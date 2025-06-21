import type { Socket } from 'socket.io';
import type { AuthenticationService } from '../authentication/authentication.service';

export class ChatService {
  constructor(private readonly authService: AuthenticationService) {}

  async getUserIdFromToken(io: Socket) {
    const token = io.handshake.auth.token;
    return await this.authService.getUserByAccessToken(token);
  }
}
