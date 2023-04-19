import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Get,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import SignInDto from 'src/interfaces/signIn.dto';
import SignUpDto from 'src/interfaces/signUp.dto';
import { AuthGuard } from './auth.guard';

import { Request as expressRequest } from 'express';
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() signInDto: SignInDto) {
    console.log(signInDto);
    return this.authService.signIn(signInDto.username, signInDto.password);
  }
  @Post('register')
  register(@Body() signUpDto: SignUpDto) {
    console.log(signUpDto);
    return this.authService.register(
      signUpDto.username,
      signUpDto.password,
      signUpDto.nickname,
    );
  }
  @UseGuards(AuthGuard)
  @Get('getUser')
  getUser(@Request() request: expressRequest) {
    return this.authService.getUser(request);
  }
}
