import express, { Response, Request } from 'express';
import { auth } from "../middlewares/userAuth";
import { userRegistration, getOtp, forgotPassword, resetPassword, verifyOtp, updateProfilePicture, userLogin } from '../controllers/userController';
import { uploadProfile } from '../middlewares/profileUpload';
import { validateSignupUser, validateLoginUser, validateForgotPassword, validateChangePassword } from '../middlewares/validation';

const router = express.Router();

router.post('/signup', validateSignupUser, userRegistration);
router.post('/otp', getOtp);
router.post('/otp/verify', verifyOtp);
router.post('/login', validateLoginUser, userLogin);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateChangePassword, resetPassword);
// router.put('/upload-profile-picture', uploadProfile.array('profilePicture'), auth, updateProfilePicture);


export default router;