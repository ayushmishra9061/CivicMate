import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { login, logout, me, refresh, register } from '../controllers/authController.js';
import { validate } from '../utils/validators.js';

const router = Router();

router.post(
  '/register',
  [
    body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
    body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
    body('role').optional().isIn(['citizen', 'provider', 'admin']).withMessage('Invalid role')
  ],
  validate,
  register
);

router.post(
  '/login',
  [body('email').isEmail().normalizeEmail(), body('password').notEmpty()],
  validate,
  login
);

router.post('/refresh', [body('refreshToken').notEmpty()], validate, refresh);
router.post('/logout', authenticate, logout);
router.get('/me', authenticate, me);

export default router;
