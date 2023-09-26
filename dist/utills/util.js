"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.changePasswordSchema = exports.forgotPasswordSchema = exports.loginSchema = exports.otpSchema = exports.userSchema = void 0;
const joi_1 = __importDefault(require("joi"));
exports.userSchema = joi_1.default.object({
    firstName: joi_1.default.string().required(),
    lastName: joi_1.default.string().required(),
    email: joi_1.default.string().email().required(),
    phoneNumber: joi_1.default.string().required(),
    dateOfBirth: joi_1.default.date().iso(),
    password: joi_1.default.string().min(6).required(),
    confirmPassword: joi_1.default.string().valid(joi_1.default.ref('password')).required().messages({
        'any.only': 'Passwords do not match.',
    }),
    gender: joi_1.default.string().valid('male', 'female', 'null').default('null'),
    bio: joi_1.default.string().allow('').default(''),
    location: joi_1.default.string().allow('').default(''),
    socialLinks: joi_1.default.object({
        facebook: joi_1.default.string().allow('').default(''),
        instagram: joi_1.default.string().allow('').default(''),
        twitter: joi_1.default.string().allow('').default(''),
        linkedin: joi_1.default.string().allow('').default(''),
    }),
    otp: joi_1.default.number(),
    otp_expiry: joi_1.default.date().iso(),
    profilePicture: joi_1.default.string().allow('').default(''),
    userType: joi_1.default.string().valid('doctor', 'regular', 'admin').default('regular'),
    isVerified: joi_1.default.boolean().default(false),
    isLocked: joi_1.default.boolean().default(false),
    role: joi_1.default.string().valid('user', 'admin'),
});
exports.otpSchema = joi_1.default.object({
    otp: joi_1.default.number().required(),
    otp_expiry: joi_1.default.date().required(),
});
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
});
exports.forgotPasswordSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
});
exports.changePasswordSchema = joi_1.default.object()
    .keys({
    password: joi_1.default.string().required(),
    otp: joi_1.default.number().required(),
    confirmPassword: joi_1.default.any()
        .equal(joi_1.default.ref('password'))
        .required()
        .label('Confirm password')
        .messages({ 'any.only': '{{#label}} does not match' }),
})
    .with('password', 'confirmPassword');
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: '',
        },
    },
};
//# sourceMappingURL=util.js.map