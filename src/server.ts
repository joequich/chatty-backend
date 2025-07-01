import { App } from './app';
import env from './common/config/env.config';
import { DrizzleService } from './database/drizzle.service';

try {
  const drizzle = new DrizzleService(env);
  const app = new App(env, drizzle);
  app.start();
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message);
  } else {
    console.error(error);
  }
  process.exit(1);
}
