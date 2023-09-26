"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require('../utills/google');
const userController_1 = require("../controllers/userController");
const validation_1 = require("../middlewares/validation");
const router = express_1.default.Router();
// router.get('/', (req: Request, res: Response) => {
//     res.send('<a href="http://localhost:8081/"> Login with Google </a>');
// });
// router.get('/auth/google', (req: Request, res: Response) => {
//     passport.authenticate('google', { scope: ['profile', 'email'] });
//     res.send('Welcome to Medly');
// });
router.post('/signup', validation_1.validateSignupUser, userController_1.userRegistration);
router.post('/otp', userController_1.getOtp);
router.post('/otp/verify', userController_1.verifyOtp);
router.post('/login', validation_1.validateLoginUser, userController_1.userLogin);
router.post('/forgot-password', validation_1.validateForgotPassword, userController_1.forgotPassword);
router.post('/reset-password', validation_1.validateChangePassword, userController_1.resetPassword);
exports.default = router;
//# sourceMappingURL=userRoute.js.map