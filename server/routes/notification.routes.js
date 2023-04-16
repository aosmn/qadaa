import express from 'express';
import { subscribe, unsubscribe } from '../controllers/notifications.controller.js';
import { protect } from '../middleware/auth.middleware.js';
const router = express.Router();

// Create route for allow client to subscribe to push notification.
router.route('/').post(protect, subscribe).delete(protect, unsubscribe);

export default router;
