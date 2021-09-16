import { MiddlewareConsumer, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { AuthService } from './auth.service';
// import { CurrentUserInterceptor } from '../interceptors/current-user.interceptor';
// import { APP_INTERCEPTOR } from '@nestjs/core';
import { CurrentUserMiddleware } from '../user/middleware/current-user.middleware';

// APP_INTERCEPTOR makes an interceptor globablly scoped instead of limiting scopr to a single repo.
@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    AuthService,
    // {
    //   provide: APP_INTERCEPTOR,
    //   useClass: CurrentUserInterceptor,
    // },
  ],
  controllers: [UserController],
})
export class UserModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CurrentUserMiddleware).forRoutes('*');
  }
}
