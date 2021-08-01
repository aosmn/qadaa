import express from 'express';
import {
    getPrayerTimes,
    getCalculationMethods
} from '../controllers/prayerTimes.controller.js';
import { protect } from '../middleware/auth.middleware.js';
const router = express.Router();

router.route('/').get(protect, getPrayerTimes);
router.route('/methods').get(protect, getCalculationMethods);
router.route('/:day').get(protect, getPrayerTimes);

export default router;
