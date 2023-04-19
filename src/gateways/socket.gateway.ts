import {
  UseFilters,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Server as SocketIOServer, Socket } from 'socket.io';

import { NestGateway } from '@nestjs/websockets/interfaces/nest-gateway.interface';
import { JwtService } from '@nestjs/jwt';

import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  MessageBody,
} from '@nestjs/websockets';
import { UsersService } from 'src/users/users.service';
import {
  AuthSocket,
  WSAuthMiddleware,
} from 'src/socket-auth/socket-auth.middleware';
import { AuthGuard } from 'src/auth/auth.guard';
import SendMessageDto from 'src/interfaces/sendMessage.dto';

@UsePipes(new ValidationPipe())
@WebSocketGateway({
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    transports: ['websocket', 'polling'],
    credentials: true,
  },
  allowEIO3: true,
  namespace: '/', //this is the namespace, which manager.socket(nsp) connect to
})
export class WsRoomGateway implements NestGateway {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UsersService,
  ) {}
  @WebSocketServer()
  server: SocketIOServer;

  afterInit(server: SocketIOServer) {
    const middle = WSAuthMiddleware(this.jwtService, this.userService);
    server.use(middle);
    console.log(`WS ${WsRoomGateway.name} init`);
  }
  handleDisconnect(client: Socket) {
    console.log('client disconnect', client.id);
  }

  handleConnection(client: AuthSocket, ...args: any[]) {
    console.log('client connect', client.id, client.user);
  }

  sendMessage(message: SendMessageDto) {
    console.log(message);
    this.server.emit('new-message', message);
  }

  @SubscribeMessage('iamconnected')
  handleCreateRoom(
    @ConnectedSocket() client: AuthSocket,
    @MessageBody() body: any,
  ) {
    client.send('test', body);
  }
}
