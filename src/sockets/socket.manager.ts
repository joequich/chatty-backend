import type { Server as HttpServer } from 'node:http';
import { type Socket, Server as SocketIOServer } from 'socket.io';
import { AuthenticationService } from '../authentication/authentication.service';
import corsConfig from '../common/config/cors.config';
import type { EnvConfig } from '../common/config/env.config';
import type { DrizzleService } from '../database/drizzle.service';
import { MessageService } from '../messages/message.service';
import { UserService } from '../user/user.service';
import { ChatSocketController } from './chat-socket.controller';
import { SocketConnectionService } from './services/socket-connection.service';
import { SocketPresenceService } from './services/socket-presence.service';
import { socketAuthMiddleware } from './socket.middleware';

export class SocketManager {
  private io: SocketIOServer;
  private socketConnectionService: SocketConnectionService;
  private socketPresenceService: SocketPresenceService;
  private authService: AuthenticationService;
  private userService: UserService;
  private messageService: MessageService;
  private chatSocketController: ChatSocketController;

  constructor(
    private readonly env: EnvConfig,
    private readonly httpServer: HttpServer,
    private readonly drizzleService: DrizzleService,
  ) {
    this.io = new SocketIOServer(this.httpServer, {
      cors: corsConfig,
    });

    this.userService = new UserService(this.drizzleService);
    this.authService = new AuthenticationService(this.env, this.drizzleService, this.userService);
    this.messageService = new MessageService(this.drizzleService);
    this.socketConnectionService = new SocketConnectionService();
    this.socketPresenceService = new SocketPresenceService(this.io, this.socketConnectionService, this.userService);
    this.chatSocketController = new ChatSocketController(this.io, this.socketPresenceService, this.messageService);
  }

  public async initialize() {
    this.io.use(socketAuthMiddleware(this.authService));

    this.io.on('connection', (socket: Socket) => {
      const user = socket.data.user;
      console.log(`User connected: ${user.username}, Socket ID: ${socket.id}`);

      this.socketConnectionService.addSocket(user.id, socket.id);
      this.socketPresenceService.handleUserOnline(user.id);
      socket.join('general-chat');

      this.chatSocketController.registerListeners(socket);

      socket.on('disconnect', (reason: string) => {
        console.log(`User disconnected: ${user.username}, Socket ID: ${socket.id} - reason: ${reason}`);
        this.socketConnectionService.removeSocket(user.id, socket.id);
        this.socketPresenceService.handleUserOffline(user.id);
      });
    });
  }
}
