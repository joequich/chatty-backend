import type { z } from 'zod';
import type { signInSchema, signUpSchema } from './authentication.schema';

export type SignUpDto = z.infer<typeof signUpSchema>;
export type SignInDto = z.infer<typeof signInSchema>;
