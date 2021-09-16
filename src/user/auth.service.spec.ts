import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('Auth Service', () => {
  let service: AuthService;
  let fakeUserService: Partial<UserService>;

  beforeEach(async () => {
    const users: User[] = [];

    // create fake copy of user service
    //   UserRepo calls are promise based and promise.resolve() ensures there is no waiting and the result from the fake user service is returned immediately
    fakeUserService = {
      findAll: (email: string) => {
        const user = users.filter((user) => user.email === email);
        return Promise.resolve(user);
      },
      create: (email: string, password: string) => {
        const user = {
          id: Math.floor(Math.random() * 9999),
          email,
          password,
        } as User;
        users.push(user);
        return Promise.resolve(user);
      },
    };

    //   authService requires UserService so giving a fakeUserService
    //   below { provide, useValue } means if anything asks for UserService, provide the fakeUserService
    //   this is done to skip the need of contacting the userRepository and ease of testing
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UserService,
          useValue: fakeUserService,
        },
      ],
    }).compile();

    service = module.get(AuthService);
  });

  it('can create an instance of auth service', async () => {
    expect(service).toBeDefined();
  });

  it('creates a new user with a salted and hashed password', async () => {
    const user = await service.signUp('test@test.com', 'password');
    const [salt, hash] = user.password.split('.');
    expect(salt).toBeDefined();
    expect(hash).toBeDefined();
  });

  // assuming the fakeUserService returns a fixed user and since in auth.service an error is thrown if
  // user.length is true, an error is expected here
  it('throws an error if user signs up with an email which is already in use', async () => {
    await service.signUp('test@test.com', 'password');
    await expect(
      service.signUp('test@test.com', 'password'),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('throws an error if signin is called with an unused email', async () => {
    try {
      await service.signIn('test@test.com', 'password');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('No user found');
    }
  });

  it('throws if an invalid password is provided', async () => {
    await service.signUp('test@test.com', 'password');
    try {
      await service.signIn('test@test.com', 'chintu');
    } catch (err) {
      expect(err).toBeInstanceOf(BadRequestException);
      expect(err.message).toBe('Invalid credentials');
    }
  });

  // Method #1: use signup to create a user and get salted hash password and copy paste in fakeUserService Promise resolve
  // Disadvantage would be that code would be chunky and if the hashed pswd is mispelled, test would fail
  // Method #2: create a signup that actually hashes pswd and stores in memory. This can be used for future signin
  // Advantage: cleaner code + future more complex tests could need user to be signed in. Hence, data in memory can be useful for testing
  it('returns a user if correct password is provided', async () => {
    await service.signUp('test@test.com', 'password');
    const user = await service.signIn('test@test.com', 'password');
    expect(user).toBeDefined();
  });
});
