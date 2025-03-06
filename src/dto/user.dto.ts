import type { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import type { usersTable } from '../database/database.schema';

export type UserDto = Omit<InferSelectModel<typeof usersTable>, 'password'>;
export type CreateUserDto = Omit<InferInsertModel<typeof usersTable>, 'username'>;
