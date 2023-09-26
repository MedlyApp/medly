import { Request, Response, NextFunction } from 'express';
import {
    options,
    userSchema,
    loginSchema,
    forgotPasswordSchema,
    changePasswordSchema,
    otpSchema, postSchema,
} from '../utills/util';

export const validateSignupUser = (req: Request, res: Response, next: NextFunction) => {
    const validateUser = userSchema.validate(req.body, options);
    if (validateUser.error) {
        return res.status(400).json({
            status: 400,
            message: validateUser.error.details[0].message,
        });
    }
    next();
};

export const validateLoginUser = (req: Request, res: Response, next: NextFunction) => {
    const validateResult = loginSchema.validate(req.body, options);
    if (validateResult.error) {
        return res.status(400).json({ message: validateResult.error.details[0].message });
    }
    next();
};
export const validateOtp = (req: Request, res: Response, next: NextFunction) => {
    const validateResult = otpSchema.validate(req.body, options);
    if (validateResult.error) {
        return res.status(400).json({ message: validateResult.error.details[0].message });
    }
    next();
};

export const validateForgotPassword = (req: Request, res: Response, next: NextFunction) => {
    const validateResult = forgotPasswordSchema.validate(req.body, options);
    if (validateResult.error) {
        return res.status(400).json({ message: validateResult.error.details[0].message });
    }
    next();
};

export const validateChangePassword = (req: Request, res: Response, next: NextFunction) => {
    const validateResult = changePasswordSchema.validate(req.body, options);
    if (validateResult.error) {
        return res.status(400).json({
            message: validateResult.error.details[0].message,
        });
    }
    next();
};

export const validatePost = (req: Request, res: Response, next: NextFunction) => {
    const validateResult = postSchema.validate(req.body, options);
    if (validateResult.error) {
        return res.status(400).json({
            message: validateResult.error.details[0].message,
        });
    }
    next();
};
