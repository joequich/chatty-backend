import { desc, lt } from 'drizzle-orm';
import { messagesTable } from '../database/database.schema';
import type { Database, DrizzleService } from '../database/drizzle.service';
import type { CreateMessageDto, Message } from './schemas/message.dto';
import type { GetMessageHistory } from './schemas/message.schema';

export class MessageService {
  private db: Database;
  constructor(private readonly drizzleService: DrizzleService) {
    this.db = this.drizzleService.getDb();
  }

  async getHistory(limit: number, cursor?: Date): Promise<GetMessageHistory> {
    const history = await this.db
      .select()
      .from(messagesTable)
      .where(cursor ? lt(messagesTable.createdAt, cursor) : undefined)
      .orderBy(desc(messagesTable.createdAt))
      .limit(limit + 1);

    const hasMore = history.length > limit;
    const messages = hasMore ? history.slice(0, -1) : history;
    const nextCursor = hasMore ? messages[messages.length - 1].createdAt.toISOString() : null;

    return { messages, pagination: { hasMore, nextCursor } };
  }

  async createMessage(data: CreateMessageDto): Promise<Message> {
    const newMessage = await this.db
      .insert(messagesTable)
      .values({ senderId: data.senderId, content: data.content })
      .returning();
    return newMessage[0];
  }
}
