import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import exclude from 'src/libs/exclude';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { extractTokenFromHeader } from 'src/handlers';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}
  async signIn(username: string, pass: string): Promise<any> {
    const user = (await this.usersService.findOne(username, true)) as User;
    if (!user) {
      throw new UnauthorizedException('No user found.');
    }
    console.log(pass, user);
    const comparedPassword = await bcrypt.compare(pass, user.hashedPassword);

    if (!comparedPassword) {
      throw new UnauthorizedException('Incorrect credentials!');
    }

    const payload = { username: user.username, sub: user.id };
    const result = exclude(user, ['hashedPassword']);

    return {
      access_token: await this.jwtService.sign(payload, { expiresIn: 1000 }),
      ...result,
    };
  }
  async register(username: string, password: string, nickname?: string) {
    const result = await this.usersService.create(username, password, nickname);

    const payload = { username: result.username, sub: result.id };

    return {
      access_token: await this.jwtService.sign(payload),
      ...result,
    };
  }
  async getUser(request: Request) {
    const token = extractTokenFromHeader(request);
    const decodedToken = this.jwtService.decode(token);
    return this.usersService.findOne(decodedToken['username']);
  }
}
