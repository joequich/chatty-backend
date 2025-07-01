import type { Server as SocketServer } from 'socket.io';
import { AuthenticationService } from './authentication/authentication.service';
import { ChatGateway } from './chat/chat.gateway';
import { ChatService } from './chat/chat.service';
import type { EnvConfig } from './common/config/env.config';
import type { DrizzleService } from './database/drizzle.service';
import { UserService } from './user/user.service';

export function initializeGateways(env: EnvConfig, drizzleService: DrizzleService, io: SocketServer) {
  const userService = new UserService(drizzleService);
  const authService = new AuthenticationService(env, drizzleService, userService);
  const chatService = new ChatService(authService);

  new ChatGateway(io, chatService);
}
