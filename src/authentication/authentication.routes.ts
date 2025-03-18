import { Router } from 'express';
import { validateFields } from '../common/middlewares/validate-fields.middleware';
import { UserService } from '../user/user.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';
import { JwtRefreshAuthenticationMiddleware } from './jwt-refresh-authentication.middleware';
import { signInSchema, signUpSchema } from './schemas/authentication.schema';

const router = Router();

const userService = new UserService();
const authenticationService = new AuthenticationService(userService);
const authenticationController = new AuthenticationController(authenticationService);
const jwtMiddleware = new JwtRefreshAuthenticationMiddleware(userService);

router.post('/sign-up', validateFields(signUpSchema, 'body'), authenticationController.signUp);
router.post('/sign-in', validateFields(signInSchema, 'body'), authenticationController.signIn);
router.post('/refresh', jwtMiddleware.validateRefreshToken, authenticationController.refreshToken);

export default router;
