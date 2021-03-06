import express from 'express';
import {
  authUser,
  getMe,
  registerUser,
  updateUser,
  sendPasswordReset,
  passwordReset,
  updatePreferences
} from '../controllers/user.controller.js';
import { protect } from '../middleware/auth.middleware.js';
const router = express.Router();

router.route('/').post(registerUser).put(protect, updateUser);
router.post('/login', authUser);
router.get('/me', protect, getMe);
router.post('/recover', sendPasswordReset);
router.post('/reset', passwordReset);
router.put('/prefs', protect, updatePreferences);

export default router;
