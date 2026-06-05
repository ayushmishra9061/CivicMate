import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import { listProviders, registerProvider, updateProvider } from '../controllers/providerController.js';
import { validate } from '../utils/validators.js';

const router = Router();

router.use(authenticate);
router.get('/', listProviders);
router.post(
  '/',
  authorize('provider', 'admin'),
  [
    body('businessName').trim().isLength({ min: 2 }),
    body('category').isIn(['Electrician', 'Plumber', 'Carpenter', 'Cleaner', 'Technician']),
    body('phone').trim().isLength({ min: 7 })
  ],
  validate,
  registerProvider
);
router.put('/:id', [param('id').isMongoId()], validate, updateProvider);

export default router;
