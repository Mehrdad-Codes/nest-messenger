import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { WsRoomGateway } from 'src/gateways/socket.gateway';
import { UsersService } from 'src/users/users.service';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [MessagesController],
  providers: [MessagesService, WsRoomGateway],
})
export class MessagesModule {}
