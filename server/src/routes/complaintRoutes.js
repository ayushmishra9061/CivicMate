import { Router } from 'express';
import { body, param } from 'express-validator';
import { authenticate, authorize } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import {
  createComplaint,
  deleteComplaint,
  getComplaint,
  getComplaints,
  updateComplaint
} from '../controllers/complaintController.js';
import { validate } from '../utils/validators.js';

const router = Router();

router.use(authenticate);

router
  .route('/')
  .post(
    uploadImage.single('image'),
    [
      body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
      body('location').custom((value) => {
        const location = typeof value === 'string' ? JSON.parse(value) : value;
        if (typeof location.lat !== 'number' || typeof location.lng !== 'number') throw new Error();
        return true;
      }).withMessage('Location with numeric lat/lng is required')
    ],
    validate,
    createComplaint
  )
  .get(getComplaints);

router
  .route('/:id')
  .get([param('id').isMongoId()], validate, getComplaint)
  .put(
    [param('id').isMongoId(), body('status').optional().isIn(['Submitted', 'Verified', 'Assigned', 'In Progress', 'Resolved', 'Closed'])],
    validate,
    updateComplaint
  )
  .delete([param('id').isMongoId()], validate, deleteComplaint);

router.put('/:id/assign', authorize('admin'), [param('id').isMongoId(), body('assignedTo').isMongoId()], validate, updateComplaint);

export default router;
