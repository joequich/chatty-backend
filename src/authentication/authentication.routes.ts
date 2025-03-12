import { Router } from 'express';
import { UserService } from '../user/user.service';
import { resolveMockFilePath } from '../utils/resolve-mock-file-path';
import { AuthenticationController } from './authentication.controller';
import { AuthenticationService } from './authentication.service';

const router = Router();

const userService = new UserService();
const authenticationService = new AuthenticationService(userService);
const authenticationController = new AuthenticationController(authenticationService);

router.post('/sign-up', (req, res) => authenticationController.signUp(req, res));

//mocks
router.post('/sign-in', (req, res) => {
  res.status(201).sendFile(resolveMockFilePath(__dirname, 'authentication-login-mock.json'));
});

export default router;
