import { lt } from 'drizzle-orm';
import { messagesTable } from '../database/database.schema';
import type { Database, DrizzleService } from '../database/drizzle.service';
import type { CreateMessageDto, Message } from './schemas/message.dto';

export class MessageService {
  private db: Database;
  constructor(private readonly drizzleService: DrizzleService) {
    this.db = this.drizzleService.getDb();
  }

  async getHistory(before?: Date, limit = 20): Promise<Message[]> {
    const history = await this.db
      .select()
      .from(messagesTable)
      .where(before ? lt(messagesTable.createdAt, before) : undefined)
      .orderBy(messagesTable.createdAt)
      .limit(limit);

    return history;
  }

  async createMessage(data: CreateMessageDto): Promise<Message> {
    const newMessage = await this.db
      .insert(messagesTable)
      .values({ senderId: data.senderId, content: data.content })
      .returning();
    return newMessage[0];
  }
}
