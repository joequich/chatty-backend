import { Router } from 'express';
import { validateFields } from '../common/middlewares/validate-fields.middleware';
import { UserService } from '../user/user.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationMiddleware } from './authentication.middleware';
import { AuthenticationService } from './authentication.service';
import { signInSchema, signUpSchema } from './schemas/authentication.schema';

const router = Router();

const userService = new UserService();
const authService = new AuthenticationService(userService);
const authController = new AuthenticationController(authService);
const authMiddleware = new AuthenticationMiddleware(authService);

router.post('/sign-up', validateFields(signUpSchema, 'body'), authController.signUp);
router.post('/sign-in', validateFields(signInSchema, 'body'), authController.signIn);
router.post('/sign-out', authController.signOut);
router.post('/refresh', authMiddleware.validateRefreshToken, authController.refreshToken);

export default router;
