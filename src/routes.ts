import { Router } from 'express';
import authenticationRoutes from './authentication/authentication.routes';
import userRoutes from './user/user.routes';

const router = Router();

router.use('/users', userRoutes);
router.use('/authentication', authenticationRoutes);

export default router;
