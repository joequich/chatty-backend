import { messagesTable } from '../database/database.schema';
import type { Database, DrizzleService } from '../database/drizzle.service';
import type { CreateMessageDto, Message } from './schemas/message.dto';

export class MessageService {
  private db: Database;
  constructor(private readonly drizzleService: DrizzleService) {
    this.db = this.drizzleService.getDb();
  }

  async createMessage(data: CreateMessageDto): Promise<Message> {
    const newMessage = await this.db
      .insert(messagesTable)
      .values({ senderId: data.senderId, content: data.content })
      .returning();
    return newMessage[0];
  }
}
