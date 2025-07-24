import { Router } from 'express';
import { AuthenticationMiddleware } from '../authentication/authentication.middleware';
import { AuthenticationService } from '../authentication/authentication.service';
import type { EnvConfig } from '../common/config/env.config';
import type { DrizzleService } from '../database/drizzle.service';
import { UserService } from '../user/user.service';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';

const messageRoutes = (env: EnvConfig, drizzleService: DrizzleService): Router => {
  const router = Router();

  const userService = new UserService(drizzleService);
  const messageService = new MessageService(drizzleService);
  const messageController = new MessageController(messageService);
  const authService = new AuthenticationService(env, drizzleService, userService);
  const authMiddleware = new AuthenticationMiddleware(authService);

  router.get('/history', authMiddleware.validateJwt, messageController.getMessagesHistory);

  return router;
};

export default messageRoutes;
