import { Injectable } from '@nestjs/common';
import { UserSignupDto } from './dtos/user-signup.dto';
import { UsersService } from 'src/users/users.service';
import { UserEntity } from 'src/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}
  async userSignUp(user: UserSignupDto) {
    const { email, password, username } = user;
    const hashedPassword = await this.hashPassword(password);
    const userEntity: Partial<UserEntity> = {
        email,
        password_hash: hashedPassword,
        username
    };
    return await this.usersService.createUser(userEntity);
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
}
