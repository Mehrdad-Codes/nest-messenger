import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { AuthGuard } from 'src/auth/auth.guard';

interface Options {
  userId: string;
}

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @UseGuards(AuthGuard)
  @Get(':userId')
  async getUser(@Param('userId') userId: string) {
    return this.usersService.findById(userId);
  }
}
