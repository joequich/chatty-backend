import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import env from '../env.config';
import { databaseSchema } from './database.schema';

export class DrizzleService {
  private static instance: DrizzleService;
  private pool: Pool;
  private db: NodePgDatabase<typeof databaseSchema>;

  private constructor() {
    try {
      this.pool = new Pool({ connectionString: env.DB_URL });

      this.pool.on('error', (err) => {
        console.error('Database connection error:', err.message);
      });

      this.db = drizzle(this.pool, { schema: databaseSchema });
      console.log('Database connected');
    } catch (error) {
      console.error('Error initializing database:', error);
      throw new Error('Failed to connect to the database');
    }
  }

  static getInstance(): DrizzleService {
    if (!DrizzleService.instance) {
      DrizzleService.instance = new DrizzleService();
    }
    return DrizzleService.instance;
  }

  getDb(): NodePgDatabase<typeof databaseSchema> {
    return this.db;
  }
}
