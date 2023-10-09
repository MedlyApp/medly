import express, { Response, Request } from 'express';
// import { googleSignIn } from '../controllers/googleAuth';
import { auth } from "../middlewares/userAuth";
import {
    userRegistration, getOtp,
    forgotPassword, resetPassword,
    verifyOtp, updateProfilePicture, userLogin
} from '../controllers/userController';
import {
    validateSignupUser, validateLoginUser,
    validateForgotPassword, validateChangePassword
} from '../middlewares/validation';
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();


// router.get('/auth/google', googleSignIn);
router.post('/signup', validateSignupUser, userRegistration);
router.post('/otp', getOtp);
router.post('/otp/verify', verifyOtp);
router.post('/login', validateLoginUser, userLogin);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateChangePassword, resetPassword);
router.post('/upload-profile-picture', upload.single('image'), auth, updateProfilePicture);


export default router;