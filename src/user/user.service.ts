import { eq } from 'drizzle-orm';
import type { NodePgDatabase } from 'drizzle-orm/node-postgres';
import { type databaseSchema, usersTable } from '../database/database.schema';
import { DrizzleService } from '../database/drizzle.service';
import { generateRandomString } from '../utils/generate-random';
import type { CreateUserDto } from './schemas/user.dto';

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
        where: eq(usersTable.username, username),
      });
      if (!usernameFounded) {
        isUnique = true;
      }
    }

    return username;
  }

  async getAll() {
    return await this.db.select().from(usersTable);
  }

  async getById(id: string) {
    try {
      const user = await this.db.query.usersTable.findFirst({ where: eq(usersTable.id, id) });
      return user;
    } catch {
      throw new Error('Some error while reading user by id');
    }
  }

  async getByEmail(email: string) {
    try {
      const user = await this.db.query.usersTable.findFirst({ where: eq(usersTable.email, email) });
      return user;
    } catch {
      throw new Error('Some error while reading user email credencial');
    }
  }

  async create(user: CreateUserDto) {
    try {
      const username = await this.generateUniqueUsername();
      const createdUser = await this.db
        .insert(usersTable)
        .values({
          ...user,
          username,
        })
        .returning({ username: usersTable.username, email: usersTable.email });
      return createdUser.pop();
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
