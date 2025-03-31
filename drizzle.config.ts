import { defineConfig } from 'drizzle-kit';
import env from './src/common/config/env.config';

export default defineConfig({
  schema: './src/database/database.schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.dbUrl,
  },
});
