import { createInsertSchema } from 'drizzle-zod';
import type { Request } from 'express';
import { type ZodTypeAny, z } from 'zod';
import { messagesTable } from '../../database/database.schema';
import type { Message } from './message.dto';

export const insertMessageSchema = createInsertSchema(messagesTable);

export const getMessagesHistorySchema = z.object({
  cursor: z
    .string()
    .datetime()
    .transform((value) => new Date(value))
    .optional(),
  limit: z.coerce.number({ message: 'Limit must be a number between 1 and 100' }).min(1).max(100).default(20),
});

type QueryMessagesHistory = z.infer<typeof getMessagesHistorySchema>;

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type RequestQueryMessagesHistory = Request<{}, {}, {}, QueryMessagesHistory>;

export type GetMessageHistory = {
  messages: Message[];
  pagination: {
    hasMore: boolean;
    nextCursor: string | null;
  };
};
