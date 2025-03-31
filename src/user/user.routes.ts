import { Router } from 'express';
import { AuthenticationMiddleware } from '../authentication/authentication.middleware';
import { AuthenticationService } from '../authentication/authentication.service';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);
const authService = new AuthenticationService(userService);
const authMiddleware = new AuthenticationMiddleware(authService);

router.get('/me', authMiddleware.validateJwt, userController.getById);

export default router;
