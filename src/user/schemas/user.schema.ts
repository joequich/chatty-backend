import { createInsertSchema } from 'drizzle-zod';
import { usersTable } from '../../database/database.schema';

export const insertUserSchema = createInsertSchema(usersTable).omit({
  username: true,
});
