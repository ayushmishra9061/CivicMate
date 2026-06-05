import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import { analytics, listUsers } from '../controllers/adminController.js';

const router = Router();

router.use(authenticate, authorize('admin'));
router.get('/analytics', analytics);
router.get('/users', listUsers);

export default router;
