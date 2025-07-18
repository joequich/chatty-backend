import { Router } from 'express';
import { AuthenticationMiddleware } from '../authentication/authentication.middleware';
import { AuthenticationService } from '../authentication/authentication.service';
import type { EnvConfig } from '../common/config/env.config';
import type { DrizzleService } from '../database/drizzle.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const userRoutes = (env: EnvConfig, drizzleService: DrizzleService): Router => {
  const router = Router();

  const userService = new UserService(drizzleService);
  const userController = new UserController(userService);
  const authService = new AuthenticationService(
    env,
    drizzleService,
    userService,
  );
  const authMiddleware = new AuthenticationMiddleware(authService);

  router.get('/me', authMiddleware.validateJwt, userController.getById);

  return router;
};

export default userRoutes;
