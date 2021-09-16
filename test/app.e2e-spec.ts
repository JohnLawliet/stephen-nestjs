import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

// NOTE: having multiple e2e files makes jest try to run all files in parallel. If each e2e file contains a db connection then
// an SQLite error would be thrown. Best is to run 1 test at a time so add --maxWorkers=1 for test:e2e.
// Above tells jest to test 1 file at a time
describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  // e2e test directly imports the app module skipping the main.ts file which holds config for cookie-session and validation pipe
  // Hence, it throws a 500 internal server error as userId would be undefined
  // Sol #1: abstract the cookieSession() and app.useGlobalPipes() into a separate file, say setup.ts and use it for main.ts and in test
  // Sol #2: instead of setting up cookie and validationpipe in main.ts, setup in app.module directly
  it('handles a signup request', () => {
    const email = 'bruh@bruh.com';
    return request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password' })
      .expect(201)
      .then((res) => {
        const { id, email } = res.body;
        expect(id).toBeDefined();
        expect(email).toEqual(email);
      });
  });

  it('signup as a new user then get the currently logged in user', async () => {
    const email = 'bruh@bruh.com';
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'password' })
      .expect(201);

    const cookie = res.get('Set-Cookie');
    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
  });
});
