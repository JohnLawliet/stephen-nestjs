import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Executioncontext can be replaced by Request but it covers HTTP, Websocket, grpc, graphql. Its a wrapper around incoming request
// custom decorators can't access dependency injection db i.e can't access user database or services. Hence, an interceptor is to be used
// to get the data from user database and pass it to custom decorator
export const CurrentUser = createParamDecorator(
  (data: never, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
