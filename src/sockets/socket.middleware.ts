import type { Socket } from 'socket.io';
import type { AuthenticationService } from '../authentication/authentication.service';

export const socketAuthMiddleware = (authService: AuthenticationService) => {
  return async (socket: Socket, next: (err?: Error) => void) => {
    try {
      const token = socket.handshake.auth.token as string;

      if (!token) {
        return next(new Error('Authentication error: No token provided'));
      }

      const user = await authService.getUserByAccessToken(token);
      if (!user) {
        return next(new Error('Authentication error: User not found'));
      }

      socket.data.user = user;
      return next();
    } catch (error) {
      return next(new Error('Authentication error: Invalid or expired token'));
    }
  };
};
