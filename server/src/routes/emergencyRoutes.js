import { Router } from 'express';
import { query } from 'express-validator';
import { authenticate } from '../middleware/auth.js';
import { nearby } from '../controllers/emergencyController.js';
import { validate } from '../utils/validators.js';

const router = Router();
const geoValidation = [query('lat').isFloat({ min: -90, max: 90 }), query('lng').isFloat({ min: -180, max: 180 })];

router.use(authenticate);
router.get('/hospitals', geoValidation, validate, nearby('hospitals'));
router.get('/police', geoValidation, validate, nearby('police'));
router.get('/firestations', geoValidation, validate, nearby('firestations'));
router.get('/ambulance', geoValidation, validate, nearby('ambulance'));

export default router;
