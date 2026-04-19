import express from 'express';
import * as authController from '../controllers/authController';
import { signupValidator, loginValidator } from '../middleware/validators';

const router = express.Router();

router.post('/signup', signupValidator, authController.signup);
router.post('/login', loginValidator, authController.login);

export default router;
