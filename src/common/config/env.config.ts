import fs from 'node:fs';
import path from 'node:path';
import { config } from 'dotenv';
import minimist from 'minimist';

interface ApiEnv {
  prefix: string;
  version: string;
}

interface JwtEnv {
  accessSecretKey: string;
  accessExpirationTime: string;
  refreshSecretKey: string;
  refreshExpirationTime: string;
}

export interface EnvConfig {
  nodeEnv: string;
  saltRounds: number;
  port: number;
  dbUrl: string;
  api: ApiEnv;
  jwt: JwtEnv;
}

const { env } = minimist(process.argv.slice(2));

const pathFile = path.resolve(
  __dirname,
  `../../../.env${env ? `.${env}` : ''}`,
);

if (fs.existsSync(pathFile)) {
  const envFound = config({ path: pathFile });

  if (envFound.error) {
    throw new Error(`Error loading env file at ${pathFile}`);
  }
} else {
  console.warn(
    `Couldn't find .env file at ${pathFile}. process.env will be used directly.`,
  );
}

const envConfig: EnvConfig = {
  nodeEnv: process.env.NODE_ENV || 'development',
  saltRounds: 10,
  port: Number.parseInt(process.env.PORT ? process.env.PORT : '', 10),
  dbUrl: process.env.DATABASE_URL || '',
  api: {
    prefix: '/api',
    version: process.env.API_VERSION || 'v1',
  },
  jwt: {
    accessSecretKey: process.env.JWT_ACCESS_SECRET_KEY || '',
    accessExpirationTime: process.env.JWT_ACCESS_EXPIRATION_TIME || '',
    refreshSecretKey: process.env.JWT_REFRESH_SECRET_KEY || '',
    refreshExpirationTime: process.env.JWT_REFRESH_EXPIRATION_TIME || '',
  },
};

export default envConfig;
