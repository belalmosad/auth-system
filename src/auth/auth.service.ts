import { BadRequestException, Injectable } from '@nestjs/common';
import { UserSignupDto } from './dtos/user-signup.dto';
import { UsersService } from '../users/users.service';
import { UserEntity } from '../users/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserSigninDto } from './dtos/user-signin.dto';
import { JwtService } from '@nestjs/jwt';
import { MessageCodes } from '../types/enums/message-codes';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}
  async userSignUp(user: UserSignupDto) {
    const { email, password, username } = user;
    const userDuplicated = await this.checkUserDuplicated(user);
    if (userDuplicated == MessageCodes.DUPLICATE_EMAIL) {
      throw new BadRequestException('Duplicate email');
    } else if (userDuplicated == MessageCodes.DUPLICATE_USERNAME) {
      throw new BadRequestException('Duplicate username');
    }
    const hashedPassword = await this.hashPassword(password);
    const userEntity: Partial<UserEntity> = {
      email,
      password_hash: hashedPassword,
      username,
    };
    return await this.usersService.createUser(userEntity);
  }

  async userSignin(userData: UserSigninDto) {
    const { username, password } = userData;
    const user = await this.usersService.getUserByUsername(username);
    if (!user) {
      throw new BadRequestException('Wrong username or password');
    }
    const hashedPassword = user.password_hash;
    const validPassword = await this.validatePassword(password, hashedPassword);
    if (!validPassword) {
      throw new BadRequestException('Wrong username or password');
    }
    const token = this.generateToken({ username });
    return token;
  }

  // Helper function
  private readonly SaltsRounds = 10;

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(this.SaltsRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  private async validatePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const compareResult = await bcrypt.compare(plainPassword, hashedPassword);
    return compareResult;
  }

  private async generateToken(payload: {}) {
    const token = this.jwtService.sign(payload);
    return token;
  }

  private async checkUserDuplicated(user: UserSignupDto) {
    const userFound = await this.usersService.getUser(
      user.username,
      user.email,
    );
    if(!userFound) return null;
    if (userFound?.email == user.email) {
      return MessageCodes.DUPLICATE_EMAIL;
    } else if (userFound.username == user.username) {
      return MessageCodes.DUPLICATE_USERNAME;
    }
  }
}
