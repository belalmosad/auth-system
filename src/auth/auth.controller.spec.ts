import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserSigninDto } from './dtos/user-signin.dto';
import { UserSignupDto } from './dtos/user-signup.dto';
import { UserEntity } from 'src/users/entities/user.entity';
import { BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const users = [] as UserEntity[];
    const mockAuthService: Partial<AuthService> = {
      userSignin: (user: UserSigninDto) => {
        const foundUser = users.find((item) => {
          return item.username == user.username
        });
        if(foundUser?.password_hash !== user.password || !foundUser) {
          throw new BadRequestException('Wrong password or username');
        }
        return Promise.resolve(JSON.stringify(user));
      },
      userSignUp: (user: UserSignupDto) => {
        const {email, username, password} = user;
        const foundUser = users.find((item) => {
          return item.email == email || item.username == username
        });
        if(foundUser) {
          throw new BadRequestException()
        }
        users.push({
          id: users.length + 1,
          email, 
          username,
          password_hash: password
        });
        const userCreated = {
          email,
          password_hash: 'hashed_pass',
          username
        }
        return Promise.resolve(userCreated as UserEntity);
      },
    }
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService
        }
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should sign user up',async () => {
    const signupUserDto = {
      username: 'test',
      email: 'test@emal.com',
      password: '123'
    }
    const result = await controller.userSignUp(signupUserDto);
    expect(result).toBeDefined();
    expect(result.success).toEqual(true);
    expect(result.createdUser).toBeDefined();
  })

  it('should not sign user up becuse of duplicate username',async () => {
    const signupUserDto = {
      username: 'test',
      email: 'test@emal.com',
      password: '123'
    }
    await controller.userSignUp(signupUserDto);
    const another = {
      username: 'test',
      email: 'test22@emal.com',
      password: '123'
    }
    await expect(controller.userSignUp(another)).rejects.toThrow(
      BadRequestException
    );
  })

  it('should not sign user up becuse of duplicate email',async () => {
    const signupUserDto = {
      username: 'test',
      email: 'test@emal.com',
      password: '123'
    }
    controller.userSignUp(signupUserDto);
    const another = {
      username: 'test22',
      email: 'test@emal.com',
      password: '123'
    }
    await expect(controller.userSignUp(another)).rejects.toThrow(
      BadRequestException
    );
  })



  it('should sign user in',async () => {
    await controller.userSignUp({
      username: 'test',
      email: 'email@email.com',
      password: '123'
    });
    const signinUser = {
      username: 'test',
      password: '123'
    }
    const result = await controller.userSignin(signinUser);
    expect(result).toBeDefined();
    expect(result.accessToken).toBeTruthy();
  })

  it('should not sign user in in case of wrong pass',async () => {
    const signupUserDto = {
      username: 'test',
      email: 'test@emal.com',
      password: '123'
    }
    await controller.userSignUp(signupUserDto);
    await expect(controller.userSignin({username: 'test', password: '456'})).rejects.toThrow(
      BadRequestException
    )
  })

  it('should not sign user in in case of no registered user',async () => {
    await expect(controller.userSignin({username: 'test', password: '123'})).rejects.toThrow(
      BadRequestException
    )
  })
});
