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
    let username = '';
    let isUnique = false;

    while (!isUnique) {
      username = generateRandomString(10);
      const usernameFounded = await this.db.query.usersTable.findFirst({
        where: eq(databaseSchema.usersTable.username, username),
      });
      if (!usernameFounded) {
        isUnique = true;
      }
    }

    return username;
  }

  async getAll() {
    return await this.db.select().from(databaseSchema.usersTable);
  }

  async getByEmail(email: string) {
    const user = await this.db.query.usersTable.findFirst({ where: eq(databaseSchema.usersTable.email, email) });

    if (!user) {
      throw new Error('User not found');
    }
    return user;
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
