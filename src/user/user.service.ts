import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { databaseSchema } from '../database/database.schema';
import { DrizzleService } from '../database/drizzle.service';

export class UserService {
  private db: NodePgDatabase<typeof databaseSchema>;

  constructor() {
    this.db = DrizzleService.getInstance().getDb();
  }
  async getAll() {
    return await this.db.select().from(databaseSchema.usersTable);
  }
}
