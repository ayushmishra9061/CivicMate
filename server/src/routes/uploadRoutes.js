import { Router } from 'express';
import { getUpload } from '../controllers/uploadController.js';

const router = Router();

router.get('/:id', getUpload);

export default router;
