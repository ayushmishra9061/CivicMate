import { Router } from 'express';
import { body } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { uploadImage } from '../middleware/upload.js';
import { chat, chatHistory, detectIssue } from '../controllers/aiController.js';
import { validate } from '../utils/validators.js';

const router = Router();

router.use(authenticate);
router.post('/detect', uploadImage.single('image'), detectIssue);
router.post('/chat', [body('message').trim().isLength({ min: 2, max: 1000 })], validate, chat);
router.get('/chat/history', chatHistory);

export default router;
