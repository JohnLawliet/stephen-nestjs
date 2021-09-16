import { CanActivate, ExecutionContext } from '@nestjs/common';

// Guard that checks for truthy or falsy values on whether incoming request has a cookie that contains userId.
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    return request.session.userId;
  }
}
