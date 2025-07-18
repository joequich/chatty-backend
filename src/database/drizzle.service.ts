import { type NodePgDatabase, drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import type { EnvConfig } from '../common/config/env.config';
import { databaseSchema } from './database.schema';

export type Database = NodePgDatabase<typeof databaseSchema>;

export class DrizzleService {
  private static instance: DrizzleService;
  private pool: Pool;
  private db: Database;
  private isInitialized = false;

  constructor(private readonly env: EnvConfig) {
    this.pool = new Pool({ connectionString: this.env.dbUrl });
    this.db = drizzle(this.pool, { schema: databaseSchema });
  }

  public async connect(): Promise<void> {
    if (this.isInitialized) {
      console.log('Drizzle pool is already connected');
      return;
    }

    try {
      await this.pool.query('SELECT 1');
      this.isInitialized = true;
      console.log('Drizzle connected successfully to database');
    } catch (error) {
      this.isInitialized = false;
      console.error('Failed to connect to database', error);
      await this.pool.end();
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isInitialized) {
      try {
        await this.pool.end();
        this.isInitialized = false;
        console.log('Drizzle pool disconnected');
      } catch (error) {
        console.error('Error disconnecting Drizzle pool', error);
        throw error;
      }
    } else {
      console.log('Drizzle pool not initialized or already disconnected.');
    }
  }

  public getDb(): Database {
    if (!this.isInitialized) {
      throw new Error('Drizzle database is not initialized. Call connect() first');
    }
    return this.db;
  }
}
