import { z } from 'zod';
import { insertUserSchema } from '../../user/schemas/user.schema';

export const signUpSchema = insertUserSchema.extend({
  email: z.string().email(),
  password: z.string().min(8),
});

export const signInSchema = z.object({
  email: z.string(),
  password: z.string().min(8),
});
