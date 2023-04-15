import express from 'express';
import { subscribe } from '../controllers/notifications.controller.js';
const router = express.Router();

// Create route for allow client to subscribe to push notification.
router.route('/').post(subscribe);

export default router;
