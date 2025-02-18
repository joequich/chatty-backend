import { integer, pgTable, timestamp, varchar } from 'drizzle-orm/pg-core';

const usersTable = pgTable('users', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  username: varchar({ length: 50 }).unique().notNull(),
  email: varchar({ length: 100 }).notNull().unique(),
  password: varchar({ length: 255 }).notNull().unique(),
  createdAt: timestamp().defaultNow(),
});

export const databaseSchema = {
  usersTable,
};

export { usersTable };
