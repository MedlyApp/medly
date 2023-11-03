"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
// import { googleSignIn } from '../controllers/googleAuth';
const userAuth_1 = require("../middlewares/userAuth");
const userController_1 = require("../controllers/userController");
const validation_1 = require("../middlewares/validation");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = express_1.default.Router();
// router.get('/auth/google', googleSignIn);
router.post('/signup', validation_1.validateSignupUser, userController_1.userRegistration);
router.post('/otp', userController_1.getOtp);
router.post('/otp/verify', userController_1.verifyOtp);
router.post('/login', validation_1.validateLoginUser, userController_1.userLogin);
router.post('/forgot-password', validation_1.validateForgotPassword, userController_1.forgotPassword);
router.post('/reset-password', validation_1.validateChangePassword, userController_1.resetPassword);
router.post('/upload-profile-picture', upload.single('image'), userAuth_1.auth, userController_1.updateProfilePicture);
router.patch('/update-profile', userAuth_1.auth, userController_1.updateProfile);
router.put('/follow', userAuth_1.auth, userController_1.follow);
router.put('/unfollow', userAuth_1.auth, userController_1.unfollow);
router.get('/profile', userAuth_1.auth, userController_1.getUserProfile);
exports.default = router;
//# sourceMappingURL=userRoute.js.map