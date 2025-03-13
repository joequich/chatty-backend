import { Router } from 'express';
import { UserService } from '../user/user.service';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

const router = Router();

const userService = new UserService();
const authenticationService = new AuthenticationService(userService);
const authenticationController = new AuthenticationController(authenticationService);

router.post('/sign-up', (req, res) => authenticationController.signUp(req, res));
router.post('/sign-in', (req, res) => authenticationController.signIn(req, res));

export default router;
