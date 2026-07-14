import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.js';
import {
    analytics,
    listUsers,
    getAllComplaints,
    updateComplaintStatus,
  } from '../controllers/adminController.js';

const router = Router();

router.use(authenticate, authorize('admin'));
router.get('/analytics', analytics);
router.get('/users', listUsers);

router.get('/complaints', getAllComplaints);

router.patch('/complaints/:id/status', updateComplaintStatus);

export default router;
