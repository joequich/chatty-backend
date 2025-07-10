import type { Socket, Server as SocketIOServer } from 'socket.io';
import type { MessageService } from '../messages/message.service';
import type { SocketPresenceService } from './services/socket-presence.service';

export class ChatSocketController {
  constructor(
    private io: SocketIOServer,
    private presenceService: SocketPresenceService,
    private messageService: MessageService,
  ) {}

  public registerListeners(socket: Socket): void {
    const user = socket.data.user;

    socket.on('presence:get_online_users', async () => {
      const onlineUsers = this.presenceService.getOnlineUsers();
      socket.emit('presence:online_users', onlineUsers);
    });

    socket.on('chat:message', async (data: { message: string }) => {
      if (!data.message || data.message.trim() === '') return;

      try {
        const savedMessage = await this.messageService.createMessage({
          senderId: user.id,
          content: data.message,
        });

        this.io.to('general-chat').emit('chat:new_message', savedMessage);
      } catch (error) {
        socket.emit('error', 'Failed to send message.');
      }
    });
  }
}
