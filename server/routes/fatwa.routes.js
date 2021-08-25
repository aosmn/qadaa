import express from 'express';
import { postFatwa, getFatwas } from '../controllers/fatwa.controller.js';
import { protect } from '../middleware/auth.middleware.js';
const router = express.Router();

router.route('/').get(getFatwas);
// .post(postFatwa);
export default router;
