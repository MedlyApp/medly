"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePost = exports.validateChangePassword = exports.validateForgotPassword = exports.validateOtp = exports.validateLoginUser = exports.validateSignupUser = void 0;
const util_1 = require("../utills/util");
const validateSignupUser = (req, res, next) => {
    const validateUser = util_1.userSchema.validate(req.body, util_1.options);
    if (validateUser.error) {
        return res.status(400).json({
            status: 400,
            message: validateUser.error.details[0].message,
        });
    }
    next();
};
exports.validateSignupUser = validateSignupUser;
const validateLoginUser = (req, res, next) => {
    const validateResult = util_1.loginSchema.validate(req.body, util_1.options);
    if (validateResult.error) {
        return res.status(400).json({ message: validateResult.error.details[0].message });
    }
    next();
};
exports.validateLoginUser = validateLoginUser;
const validateOtp = (req, res, next) => {
    const validateResult = util_1.otpSchema.validate(req.body, util_1.options);
    if (validateResult.error) {
        return res.status(400).json({ message: validateResult.error.details[0].message });
    }
    next();
};
exports.validateOtp = validateOtp;
const validateForgotPassword = (req, res, next) => {
    const validateResult = util_1.forgotPasswordSchema.validate(req.body, util_1.options);
    if (validateResult.error) {
        return res.status(400).json({ message: validateResult.error.details[0].message });
    }
    next();
};
exports.validateForgotPassword = validateForgotPassword;
const validateChangePassword = (req, res, next) => {
    const validateResult = util_1.changePasswordSchema.validate(req.body, util_1.options);
    if (validateResult.error) {
        return res.status(400).json({
            message: validateResult.error.details[0].message,
        });
    }
    next();
};
exports.validateChangePassword = validateChangePassword;
const validatePost = (req, res, next) => {
    const validateResult = util_1.postSchema.validate(req.body, util_1.options);
    if (validateResult.error) {
        return res.status(400).json({
            message: validateResult.error.details[0].message,
        });
    }
    next();
};
exports.validatePost = validatePost;
//# sourceMappingURL=validation.js.map