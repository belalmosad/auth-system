import { Body, Controller, Post } from '@nestjs/common';
import { UserSignupDto } from './dtos/user-signup.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}
    @Post('/signup')
    async userSignUp(@Body() signupData: UserSignupDto) {
        const createdUser = await this.authService.userSignUp(signupData);
        return {
            success: true,
            createdUser
        }
    }
}
