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
  nodeDev: env,
  saltRounds: 10,
  port: Number.parseInt(process.env.PORT ? process.env.PORT : '', 10),
  dbUrl: process.env.DATABASE_URL || '',
  api: {
    prefix: '/api',
    version: process.env.API_VERSION || 'v0',
  },
  jwt: {
    accessSecretKey: process.env.JWT_ACCESS_SECRET_KEY || '',
    accessExpirationTime: process.env.JWT_ACCESS_EXPIRATION_TIME || '',
    refreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY || '',
    refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME || '',
  },
};
