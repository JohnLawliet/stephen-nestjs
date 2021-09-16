import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { UserService } from '../user/user.service';

// Injectable is needed whenever dependency injections are to be accessed
// The injectable purpose is to intercept the request, check if session id is present and if present,
// add currentuser property to the Request object, which would get caught by the custom decorator.
// its possible to just use the interceptor without decorator, but then @Request() request, request.currentUser would be required
@Injectable()
export class CurrentUserInterceptor implements NestInterceptor {
  constructor(private userService: UserService) {}

  async intercept(context: ExecutionContext, handler: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { userId } = request.session || {};

    if (userId) {
      const user = await this.userService.findOne(userId);
      request.currentUser = user;
    }
    console.log('USER : ', request.currentUser, ' + userid : ', userId);

    return handler.handle();
  }
}
