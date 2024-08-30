import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const users = [] as Partial<UserEntity>[];
    const mockedUsersService: Partial<UsersService> = {
      createUser: (user: Partial<UserEntity>) => {
        users.push(user);
        return Promise.resolve(user as UserEntity);

      },
      getUserByUsername: (username: string) => {
        const user = users.find((user) => {
          return user.username === username
        });
        return Promise.resolve(user as UserEntity);
      }
    }
    const mockJwtService: Partial<JwtService> = {
      sign: (payload: {}) => {
        const stringPL = JSON.stringify(payload);
        return stringPL;
      }
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockedUsersService
        }, 
        {
          provide: JwtService,
          useValue: mockJwtService
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

});
