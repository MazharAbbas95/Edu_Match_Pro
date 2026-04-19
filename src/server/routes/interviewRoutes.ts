import express from 'express';
import * as interviewController from '../controllers/interviewController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/start', protect, interviewController.startInterview);
router.post('/save', protect, interviewController.saveExchange);
router.get('/latest', protect, interviewController.getLatestInterview);

export default router;
