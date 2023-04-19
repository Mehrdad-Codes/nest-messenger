import {
  ImATeapotException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import prisma from '../libs/prismadb';
import * as bcrypt from 'bcrypt';
import { User } from '@prisma/client';
import UserNoPassword from 'src/interfaces/user.ds';
import exclude from 'src/libs/exclude';

@Injectable()
export class UsersService {
  async findOne(
    username: string,
    includePassword: boolean = false,
  ): Promise<User | UserNoPassword | undefined> {
    const user = await prisma.user.findFirst({
      where: {
        username,
      },
    });
    const result =
      user && !includePassword ? exclude(user, ['hashedPassword']) : user;
    return result;
  }
  async findById(userId: string): Promise<UserNoPassword | undefined> {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      },
    });

    const result = exclude(user, ['hashedPassword']);
    return result;
  }
  async create(
    username: string,
    password: string,
    nickname?: string,
  ): Promise<UserNoPassword | undefined> {
    try {
      const userExists = await this.findOne(username);
      console.log(userExists);
      if (userExists) {
        throw new NotAcceptableException('This username already exists!');
      }

      const hashPassword = await bcrypt.hash(password, 12);
      const { hashedPassword, ...createdUser } = await prisma.user.create({
        data: {
          username,
          hashedPassword: hashPassword,
          nickname: nickname ? nickname : username,
        },
      });

      if (createdUser) {
        console.log(createdUser, 'success');
        return createdUser;
      } else {
        throw new ImATeapotException();
      }
    } catch (error) {
      console.log(error);
      throw new ImATeapotException();
    }
  }
}
