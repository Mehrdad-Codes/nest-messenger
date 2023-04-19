import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import UserNoPassword from 'src/interfaces/user.ds';
import { UsersService } from 'src/users/users.service';
import { extractTokenFromHandshake } from 'src/handlers';

export interface AuthSocket extends Socket {
  user: UserNoPassword;
}
export type SocketMiddleware = (
  socket: Socket,
  next: (err?: Error) => void,
) => void;
export const WSAuthMiddleware = (
  jwtService: JwtService,
  userService: UsersService,
): SocketMiddleware => {
  return async (socket: AuthSocket, next) => {
    try {
      const token = extractTokenFromHandshake(socket.handshake.auth.token);
      const jwtPayload = jwtService.verify(token);

      const userResult = await userService.findOne(jwtPayload.userID);
      if (userResult) {
        socket.user = userResult;
        next();
      } else {
        next({
          name: 'Unauthorizaed',
          message: 'Unauthorizaed',
        });
      }
    } catch (error) {
      console.error('che erori');
      next({
        name: 'Unauthorizaed',
        message: 'Unauthorizaed',
      });
    }
  };
};
