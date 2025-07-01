import { Router } from 'express';
import authRoutes from './authentication/authentication.routes';
import type { EnvConfig } from './common/config/env.config';
import type { DrizzleService } from './database/drizzle.service';
import userRoutes from './user/user.routes';

const setupApiRoutes = (env: EnvConfig, drizzleService: DrizzleService): Router => {
  const router = Router();

  router.use('/authentication', authRoutes(env, drizzleService));
  router.use('/users', userRoutes(env, drizzleService));

  router.get('/', (req, res) => {
    res.json({ message: 'CHAT API' });
  });

  return router;
};

export default setupApiRoutes;
