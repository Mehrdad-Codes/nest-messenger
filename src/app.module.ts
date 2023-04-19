import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CatsController } from './controllers/cat.controller';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AuthController } from './auth/auth.controller';
import { MessagesModule } from './messages/messages.module';
import { MessagesService } from './messages/messages.service';
import { WsRoomGateway } from './gateways/socket.gateway';

@Module({
  imports: [AuthModule, UsersModule, MessagesModule],
  controllers: [AppController, CatsController],
  providers: [AppService, MessagesService, WsRoomGateway],
})
export class AppModule {}
