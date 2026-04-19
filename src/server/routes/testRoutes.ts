import express from 'express';
import * as testController from '../controllers/testController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/start', protect, testController.startTest);
router.get('/next', protect, testController.getNextQuestion);
router.post('/submit', protect, testController.submitAnswer);
router.post('/questions', protect, testController.addQuestions);

export default router;
