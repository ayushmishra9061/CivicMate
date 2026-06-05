import { Router } from 'express';
import { param } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { listNotifications, markRead } from '../controllers/notificationController.js';
import { validate } from '../utils/validators.js';

const router = Router();

router.use(authenticate);
router.get('/', listNotifications);
router.put('/:id/read', [param('id').isMongoId()], validate, markRead);

export default router;
