import express from 'express';
import {
  updateLogs,
  getLogs,
  getDayLogs,
  // getAggregateLogs,
  // updateLogsAllDay,
  setDayLogs,
  updateDayPrayers
} from '../controllers/dayPrayerLogs.controller.js';
import { protect } from '../middleware/auth.middleware.js';
const router = express.Router();

router.route('/').post(protect, updateLogs).get(protect, getLogs);
// router.route('/all').post(protect, updateLogsAllDay);
// router.route('/totals').get(protect, getAggregateLogs);
router.route('/day').get(protect, getDayLogs);
router.route('/set').post(protect, setDayLogs).put(protect, updateDayPrayers);
// router.route('/save-offline').post(protect, saveOfflinePrayers);
// router.route('/:id')

export default router;
