import express from 'express';
import {
  updateLogs,
  getLogs,
  getDayLogs,
  getAggregateLogs,
  updateLogsAllDay,
  setDayLogs
} from '../controllers/prayerLogs.controller.js';
import { protect } from '../middleware/auth.middleware.js';
const router = express.Router();

router.route('/').post(protect, updateLogs).get(protect, getLogs);
router.route('/all').post(protect, updateLogsAllDay);
router.route('/totals').get(protect, getAggregateLogs);
router.route('/day').get(protect, getDayLogs);
router.route('/set').post(protect, setDayLogs);
// router.route('/:id')

export default router;
