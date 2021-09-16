import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

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
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: fakeUsersRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
