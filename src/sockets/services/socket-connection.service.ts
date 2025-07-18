export class SocketConnectionService {
  private userSocketMap: Map<string, Set<string>> = new Map();
  private socketUserMap: Map<string, string> = new Map();

  public addSocket(userId: string, socketId: string): void {
    if (!this.userSocketMap.has(userId)) {
      this.userSocketMap.set(userId, new Set());
    }

    this.userSocketMap.get(userId)?.add(socketId);
    this.socketUserMap.set(socketId, userId);
  }

  public removeSocket(userId: string, socketId: string): void {
    const sockets = this.userSocketMap.get(userId);
    if (sockets) {
      sockets.delete(socketId);
      if (sockets.size === 0) {
        this.userSocketMap.delete(userId);
      }
    }
    this.socketUserMap.delete(socketId);
  }

  public isUserOnline(userId: string): boolean {
    return this.userSocketMap.has(userId) && (this.userSocketMap.get(userId)?.size || 0) > 0;
  }
}
