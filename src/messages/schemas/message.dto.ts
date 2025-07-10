import type { z } from 'zod';
import type { insertMessageSchema } from './message.schema';

export type Message = z.infer<typeof insertMessageSchema>;
export type CreateMessageDto = z.infer<typeof insertMessageSchema>;
