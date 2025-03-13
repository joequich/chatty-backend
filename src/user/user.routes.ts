import { Router } from 'express';
import { JwtAuthenticationMiddleware } from '../authentication/jwt-authentication.middleware';
import { resolveMockFilePath } from '../utils/resolve-mock-file-path';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);
const jwtMiddleware = new JwtAuthenticationMiddleware();

router.get('/', jwtMiddleware.validateJwt, (req, res) => userController.getAll(req, res));

// mocks
router.get('/me', jwtMiddleware.validateJwt, (req, res) => {
  res.status(200).sendFile(resolveMockFilePath(__dirname, 'user-me-mock.json'));
});

export default router;
