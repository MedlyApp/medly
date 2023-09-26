import express, { Response, Request } from 'express';
import passport from 'passport';
require('../utills/google');
import { userRegistration, getOtp, forgotPassword, resetPassword, verifyOtp, userLogin } from '../controllers/userController';
import { validateSignupUser, validateLoginUser, validateForgotPassword, validateChangePassword } from '../middlewares/validation';


const router = express.Router();

// router.get('/', (req: Request, res: Response) => {
//     res.send('<a href="http://localhost:8081/"> Login with Google </a>');
// });

// router.get('/auth/google', (req: Request, res: Response) => {
//     passport.authenticate('google', { scope: ['profile', 'email'] });
//     res.send('Welcome to Medly');
// });
router.post('/signup', validateSignupUser, userRegistration);
router.post('/otp', getOtp);
router.post('/otp/verify', verifyOtp);
router.post('/login', validateLoginUser, userLogin);
router.post('/forgot-password', validateForgotPassword, forgotPassword);
router.post('/reset-password', validateChangePassword, resetPassword);



export default router;