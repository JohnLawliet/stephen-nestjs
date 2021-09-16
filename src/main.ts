// import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// CookieSession contains some functions that aren't compatible with es6 imports
// const cookieSession = require('cookie-session');

// whitelist strips the user input down to only the properties that are needed in input. Eg, if email and pswd are needed, user cannot send "admin:true" property along with it
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use((req, res, next) => {
    res.removeHeader('x-powered-by');
    res.removeHeader('date');
    next();
  });
  // app.use(
  //   cookieSession({
  //     name: 'cookie',
  //     keys: ['bruuu'],
  //   }),
  // );
  // app.useGlobalPipes(
  //   new ValidationPipe({
  //     whitelist: true,
  //   }),
  // );
  await app.listen(3000);
}
bootstrap();
