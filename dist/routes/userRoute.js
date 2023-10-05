"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const validation_1 = require("../middlewares/validation");
const router = express_1.default.Router();
router.post('/signup', validation_1.validateSignupUser, userController_1.userRegistration);
router.post('/otp', userController_1.getOtp);
router.post('/otp/verify', userController_1.verifyOtp);
router.post('/login', validation_1.validateLoginUser, userController_1.userLogin);
router.post('/forgot-password', validation_1.validateForgotPassword, userController_1.forgotPassword);
router.post('/reset-password', validation_1.validateChangePassword, userController_1.resetPassword);
// router.put('/upload-profile-picture', uploadProfile.array('profilePicture'), auth, updateProfilePicture);
exports.default = router;
//# sourceMappingURL=userRoute.js.map