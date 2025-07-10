import type { Server as SocketIOServer } from 'socket.io';
import type { UserService } from '../../user/user.service';
import type { SocketConnectionService } from './socket-connection.service';

export class SocketPresenceService {
  private onlineUsers: Map<string, boolean> = new Map();

  constructor(
    private readonly io: SocketIOServer,
    private readonly connectionService: SocketConnectionService,
    private readonly userService: UserService,
  ) {}

  public async handleUserOnline(userId: string): Promise<void> {
    if (!this.onlineUsers.get(userId) || !this.onlineUsers.has(userId)) {
      this.onlineUsers.set(userId, true);
      const user = await this.userService.getById(userId);
      if (user) {
        this.io.emit('presence:user_online', { userId: user.id, username: user.username });
      }
    }
  }

  public async handleUserOffline(userId: string): Promise<void> {
    if (!this.connectionService.isUserOnline(userId)) {
      this.onlineUsers.set(userId, false);
      const user = await this.userService.getById(userId);
      if (user) {
        this.io.emit('presence:user_offline', { userId: user.id, username: user.username });
      }
    }
  }

  public getOnlineUsers(): string[] {
    const onlineUsers: string[] = [];
    for (const [userId, isOnline] of this.onlineUsers.entries()) {
      if (isOnline) {
        onlineUsers.push(userId);
      }
    }
    return onlineUsers;
  }
}
