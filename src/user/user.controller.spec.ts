import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';

// Note: decorators and interceptors can't be tested here in unit testing. It would required e2e testing
// testing here is merely limited to just the methods
describe('UserController', () => {
  let controller: UserController;
  let fakeUserService: Partial<UserService>;
  let fakeAuthService: Partial<AuthService>;

  //mock of users db
  const usersCollection = [
    { id: 1099, email: 'super@user.com', password: 'pass!@#' } as User,
    { id: 2099, email: 'regular@user.com', password: 'pass!@#' } as User,
    { id: 3099, email: 'john.doe@user.com', password: 'pass!@#' } as User,
  ];

  //mock of Repository<User>
  const fakeUsersRepository = {
    findOne: (id: number) => {
      return Promise.resolve(usersCollection.find((c) => c.id === id));
    },
    findAll: () => {
      return Promise.resolve(
        usersCollection.filter((c) => c.email === 'john.doe@user.com'),
      );
    },
    remove: () => {
      return Promise.resolve([]);
    },
    update: () => {
      return Promise.resolve([]);
    },
  };

  beforeEach(async () => {
    (fakeUserService = {
      findAll: (email: string) => {
        return Promise.resolve([
          { id: 1, email, password: 'password' } as User,
        ]);
      },
      findOne: (id: number) => {
        return Promise.resolve({
          id,
          email: 'test@test.com',
          password: 'password',
        } as User);
      },
      // removeUser: () => {},
      // updatedUser: () => {},
    }),
      (fakeAuthService = {
        signIn: (email: string, password: string) => {
          return Promise.resolve({
            email,
            password,
            id: 1,
          } as User);
        },
        // signUp: () => {},
      });

    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: fakeUserService,
        },
        {
          provide: AuthService,
          useValue: fakeAuthService,
        },
        {
          provide: getRepositoryToken(User),
          useValue: fakeUsersRepository,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getAllUsers returns users with the given email id', async () => {
    const users = await controller.getAllUsers('test@test.com');
    expect(users.length).toEqual(1);
    expect(users[0].email).toEqual('test@test.com');
  });

  it('getUser returns an user with given id', async () => {
    const user = await controller.getUser('1');
    expect(user.id).toEqual(1);
  });

  it('throws NotFoundException if user is not found', async () => {
    fakeUserService.findOne = () => null;
    try {
      await controller.getUser('1');
    } catch (error) {
      expect(error).toBeInstanceOf(NotFoundException);
      expect(error.message).toBe('user not found');
    }
  });

  // Note here that signin here is similar to controller instead of the fake one.
  // yet, it works...
  it('signin updates session object and user', async () => {
    const session = { userId: -10 };
    const user = await controller.signIn(
      { email: 'test@test.com', password: 'password' },
      session,
    );
    expect(user.id).toEqual(1);
    expect(session.userId).toEqual(1);
  });
});
