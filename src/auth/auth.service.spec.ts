import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserEntity } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException } from '@nestjs/common';

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
      },
      getUser: (username: string, email: string) => {
        const user = users.find((item) => {
          return item.email == email || item.username == username;
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

  it('Should sign user up', async () => {
    const userData = {username: 'belal', password: '123', email:'belal@gmail.com'}
    const user = await service.userSignUp(userData);
    expect(user).toBeDefined();
    expect(user.username).toEqual(userData.username);
    expect(user.email).toEqual(userData.email);
    expect(user.password_hash).toBeTruthy();
  })

  it('Should fail as username is duplicated', async () => {
    const userData = {username: 'belal', password: '123', email:'belal@gmail.com'};
    const anotherUserData = {username: 'belal', password: '456', email:'another_user@gmail.com'};
    await service.userSignUp(userData);
    await expect(service.userSignUp(anotherUserData)).rejects.toThrow(
      BadRequestException
    )
  });

  it('Should fail as email is duplicated', async () => {
    const userData = {username: 'belal', password: '123', email:'belal@gmail.com'};
    const anotherUserData = {username: 'another_user', password: '456', email:'belal@gmail.com'};
    await service.userSignUp(userData);
    await expect(service.userSignUp(anotherUserData)).rejects.toThrow(
      BadRequestException
    )
  });

  it('Shoul sign user in and retun token', async () => {
    const userData = {
      username: 'test_user',
      email: 'test@gmail.com',
      password: '123'
    }
    await service.userSignUp(userData);
    const signUserData = {
      username: 'test_user',
      password: '123'
    }
    const accessToken = await service.userSignin(signUserData);
    expect(accessToken).toBeTruthy();
  });

  it('Shoul fail sign user in because of wrong password', async () => {
    const userData = {
      username: 'test_user',
      email: 'test@gmail.com',
      password: '123'
    }
    await service.userSignUp(userData);
    const signUserData = {
      username: 'test_user',
      password: '456'
    }
    await expect(service.userSignin(signUserData)).rejects.toThrow(
      BadRequestException
    );
  });

  it('Shoul fail sign user in because of wrong username', async () => {
    const userData = {
      username: 'test_user',
      email: 'test@gmail.com',
      password: '123'
    }
    await service.userSignUp(userData);
    const signUserData = {
      username: 'test_user_wrong',
      password: '123'
    }
    await expect(service.userSignin(signUserData)).rejects.toThrow(
      BadRequestException
    );
  })

});
