import { Router } from 'express';
import { UserService } from '../user/user.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtRefreshAuthenticationMiddleware } from './jwt-refresh-authentication.middleware';

const router = Router();

const userService = new UserService();
const authenticationService = new AuthenticationService(userService);
const authenticationController = new AuthenticationController(authenticationService);
const jwtMiddleware = new JwtRefreshAuthenticationMiddleware(userService);

router.post('/sign-up', authenticationController.signUp);
router.post('/sign-in', authenticationController.signIn);
router.post('/refresh', jwtMiddleware.validateRefreshToken, authenticationController.refreshToken);

export default router;
