import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { databaseSchema } from '../database/database.schema';
import { DrizzleService } from '../database/drizzle.service';
import type { CreateUserDto } from '../dto/user.dto';
import { generateRandomString } from '../utils/generate-random';

export class UserService {
  private db: NodePgDatabase<typeof databaseSchema>;

  constructor() {
    this.db = DrizzleService.getInstance().getDb();
  }

  private async generateUniqueUsername() {
    const username = generateRandomString(10);
    const isUnique = false;

    if (!isUnique) {
      const usernameFounded = await this.db
        .select()
        .from(databaseSchema.usersTable)
        .where(eq(databaseSchema.usersTable.username, username));
      if (usernameFounded.length === 0) {
        return username;
      }
    }

    return username;
  }

  async getAll() {
    return await this.db.select().from(databaseSchema.usersTable);
  }

  async create(user: CreateUserDto) {
    try {
      const username = await this.generateUniqueUsername();
      const createdUser = await this.db
        .insert(databaseSchema.usersTable)
        .values({
          ...user,
          username,
        })
        .returning();
      return createdUser.pop();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
