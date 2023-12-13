import {
  Controller,
  Post,
  Get,
  Body,
  NotImplementedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto } from './dto/signup.dto';
import { UserCreationResponse } from './dto/usercreated.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signupDto: SignUpDto): Promise<UserCreationResponse> {
    return await this.authService.signUp(signupDto);
  }

  @Post('login')
  async logIn(@Body() signupDto: SignUpDto): Promise<UserCreationResponse> {
    return await this.authService.logIn(signupDto);
  }

  @Get('logout')
  async logOut(): Promise<boolean> {
    throw new NotImplementedException();
  }
}
