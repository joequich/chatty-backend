import type { Server as SocketServer } from 'socket.io';
import { AuthenticationService } from './authentication/authentication.service';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
import { UserService } from './user/user.service';

export function initializeGateways(io: SocketServer) {
  const userService = new UserService();
  const authService = new AuthenticationService(userService);
  const chatService = new ChatService(authService);

  new ChatGateway(io, chatService);
}
