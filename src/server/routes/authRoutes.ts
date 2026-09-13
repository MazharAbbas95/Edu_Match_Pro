import express from 'express';
import * as authController from '../controllers/authController';
import { signupValidator, loginValidator, forgotPasswordValidator, resetPasswordValidator } from '../middleware/validators';

const router = express.Router();

router.post('/signup', signupValidator, authController.signup);
router.post('/login', loginValidator, authController.login);
router.post('/forgotPassword', forgotPasswordValidator, authController.forgotPassword);
router.patch('/resetPassword/:token', resetPasswordValidator, authController.resetPassword);

export default router;
