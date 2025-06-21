import type { Server, Socket } from 'socket.io';
import type { ChatService } from './chat.service';

export class ChatGateway {
  constructor(
    private readonly io: Server,
    private readonly chatService: ChatService,
  ) {
    this.io.on('connection', this.handleConnection.bind(this));
  }

  private async handleConnection(socket: Socket) {
    try {
      const user = await this.chatService.getUserIdFromToken(socket);
      if (!user) {
        socket.emit('error', 'Authentication failed');
        socket.disconnect();
      }

      socket.data.user = user;
      console.log('Usuario autenticado:', user.email);

      //eventos
      socket.on('send_message', (data) => {
        this.io.sockets.emit('receive_message', data);
      });

      socket.on('disconnect', () => {
        console.log('Usuario desconectado', socket.id);
      });
    } catch (error) {
      console.error('Error during connection:', error);
      socket.disconnect();
    }
  }
}
