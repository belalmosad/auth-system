import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { UserEntity } from './entities/user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('UsersService', () => {
  let service: UsersService;
  let users: UserEntity[] = [
    {
      id: 1,
      email: 'testone@email.com',
      password_hash: 'hashed',
      username: 'testone',
    } as UserEntity,
  ];
  beforeEach(async () => {
    const repositoryMockFactory = () => ({
      findOneBy: (finders: { username: string }) => {
        const { username } = finders;
        const user = users.find((item) => {
          return item.username === username;
        });
        return Promise.resolve(user);
      },
      findOne: (criteria: {where: [{ username: string }, {email: string}]}) => {
        const where = criteria.where;
        const username = where[0].username;
        const email = where[1].email;
        const user = users.find((item) => {
          return item.email == email || item.username == username;
        });
        return Promise.resolve(user);
      },
      create: (user: UserEntity) => {
        return user;
      },
      save: (user: UserEntity) => {
        user.id = users.length + 1;
        users.push(user);
        return Promise.resolve(user);
      },
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(UserEntity),
          useFactory: repositoryMockFactory,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create user', async () => {
    const user = {
      email: 'test@email.com',
      username: 'test',
      password: '123',
    };
    const userCreated = await service.createUser(user);
    expect(userCreated).toBeDefined();
    expect(userCreated.email).toEqual(user.email);
    expect(userCreated.username).toEqual(user.username);
  });

  it('should get user by username', async () => {
    const user = await service.getUserByUsername('testone');
    expect(user.username).toEqual('testone');
    expect(user).toBeTruthy();
  });

  it('should note get user if username is wrong', async () => {
    const user = await service.getUserByUsername('not_found_username');
    expect(user).toBeFalsy();
  });

  it('should get user by username or email', async () => {
    const user = await service.getUser('testone', 'somedummyemail');
    expect(user).toBeDefined();
    expect(user.username).toEqual('testone');
    expect(user.email).toEqual('testone@email.com');
  });

  it('should get user by username or email', async () => {
    const user = await service.getUser('somedummyusername', 'testone@email.com');
    expect(user).toBeDefined();
    expect(user.email).toEqual('testone@email.com');
    expect(user.username).toEqual('testone');
  });
  
  it('should note get user by username or email in case of wrong data', async () => {
    const user = await service.getUser('somedummyusername', 'somedummyemail');
    expect(user).toBeFalsy();
  });
});
