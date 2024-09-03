import { Body, Controller, Post } from '@nestjs/common';
import { UserSignupDto } from './dtos/user-signup.dto';
import { AuthService } from './auth.service';
import { UserSigninDto } from './dtos/user-signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  async userSignUp(@Body() signupData: UserSignupDto) {
    const createdUser = await this.authService.userSignUp(signupData);
    return createdUser;
  }

  @Post('/signin')
  async userSignin(@Body() signinUser: UserSigninDto) {
    const accessToken = await this.authService.userSignin(signinUser);
    return { accessToken };
  }
}
