import express from 'express';
import * as assessmentController from '../controllers/assessmentController';
import { protect, deserializeUser } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/submit', deserializeUser, assessmentController.submitAssessment);
router.get('/latest', protect, assessmentController.getLatestAssessment);

export default router;
