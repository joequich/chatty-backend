import type { z } from 'zod';
import type { insertUserSchema } from './user.schema';

export type CreateUserDto = z.infer<typeof insertUserSchema>;
