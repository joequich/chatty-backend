import path from 'node:path';
import { config } from 'dotenv';
import minimist from 'minimist';

const { env } = minimist(process.argv.slice(2));

const pathFile = path.resolve(__dirname, `../.env${env ? `.${env}` : ''}`);
const envFound = config({ path: pathFile });

if (envFound.error) {
  throw new Error("Couldn't find .env file");
}

export default {
  NODE_ENV: env,
  PORT: Number.parseInt(process.env.PORT ? process.env.PORT : '', 10),
  DB_URL: process.env.DATABASE_URL || '',
  API: {
    prefix: '/api',
  },
  JWT: {
    ACCESS_SECRET_KEY: process.env.JWT_ACCESS_SECRET_KEY,
    ACCESS_EXPIRATION_TIME: process.env.JWT_ACCESS_EXPIRATION_TIME,
    REFRESH_SECRET_KEY: process.env.JWT_REFRESH_SECRET_KEY,
    REFRESH_EXPIRATION_TIME: process.env.JWT_REFRESH_EXPIRATION_TIME,
  },
};
