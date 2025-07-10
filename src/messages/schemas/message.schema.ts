import { createInsertSchema } from 'drizzle-zod';
import { messagesTable } from '../../database/database.schema';

export const insertMessageSchema = createInsertSchema(messagesTable);
