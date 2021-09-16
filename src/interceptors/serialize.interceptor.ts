import {
  CallHandler,
  ExecutionContext,
  NestInterceptor,
  UseInterceptors,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { map, Observable } from 'rxjs';

export function Serialize(dto: any) {
  return UseInterceptors(new SerializeInterceptor(dto));
}

// setting up a constructor here so as to be able to send a DTO to the interceptor
export class SerializeInterceptor implements NestInterceptor {
  constructor(private dto: any) {}

  intercept(context: ExecutionContext, handler: CallHandler): Observable<any> {
    // code that executes before request reaches the request handler

    return handler.handle().pipe(
      // data is the user instance
      map((data: any) => {
        // run code before response is sent out
        // excludeExtraneousValues means to share only those attrs that are specifically marked with expose directive
        return plainToClass(this.dto, data, {
          excludeExtraneousValues: true,
        });
      }),
    );
  }
}
