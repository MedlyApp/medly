import express, { Response, Request } from 'express';
import { userRegistration, getOtp, forgotPassword, resetPassword, verifyOtp, userLogin } from '../controllers/userController';
import { validateSignupUser, validateLoginUser, validateForgotPassword, validateChangePassword } from '../middlewares/validation';


const router = express.Router();


router.post('/signup', validateSignupUser, userRegistration);
router.post('/otp', getOtp);
router.post('/otp/verify', verifyOtp);
router.post('/login', validateLoginUser, userLogin);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateChangePassword, resetPassword);



export default router;