import { Injectable, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/auth/auth.guard';
import prisma from '../libs/prismadb';
import SendMessageDto from 'src/interfaces/sendMessage.dto';
import { WsRoomGateway } from 'src/gateways/socket.gateway';

const GET_MESSAGES_COUNT_LIMIT = 50;

@Injectable()
export class MessagesService {
  constructor(private readonly socketGateway: WsRoomGateway) {}
  async aquireMessages(pagination?: number) {
    const skipCount = GET_MESSAGES_COUNT_LIMIT * (pagination || 0);

    const messages = await prisma.message.findMany({
      skip: skipCount,
      take: 52,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return messages;
  }

  async sendMessage(message: SendMessageDto) {
    const { body, userId, repliedTo } = message;
    const result = await prisma.message.create({
      data: {
        body,
        userId,
        repliedTo,
      },
    });
    this.socketGateway.sendMessage(result);
    return result;
  }
}
