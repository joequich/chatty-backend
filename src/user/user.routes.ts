import { Router } from 'express';
import { resolveMockFilePath } from '../utils/resolve-mock-file-path';
import { UserController } from './user.controller';
import { UserService } from './user.service';

const router = Router();

const userService = new UserService();
const userController = new UserController(userService);

router.get('/', (req, res) => userController.getAll(req, res));

// mocks
router.get('/me', (req, res) => {
  res.status(200).sendFile(resolveMockFilePath(__dirname, 'user-me-mock.json'));
});

export default router;
