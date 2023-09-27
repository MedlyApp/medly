import { User, UserInterface } from '../models/userSchema'; import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs'
import { generateLoginToken } from '../utills/helperMethods';
import { errorResponse, successResponse, successResponseLogin } from '../utills/helperMethods';
import mailer from '../mailers/sendMail';
import { Otp } from '../models/otpSchema';
import { htmlTemplate, GenerateOtp } from '../mailers/mailTemplate';
const jwtsecret = process.env.JWT_SECRET as string;
const fromUser = process.env.FROM as string;

interface jwtPayload {
    email: string;
    _id: mongoose.Types.ObjectId;

}



export const userRegistration = async (req: Request, res: Response, next: NextFunction) => {
    const registrationData: UserInterface = req.body;
    try {
        const duplicateEmail = await User.findOne({ email: req.body.email })

        if (duplicateEmail) {
            return errorResponse(res, 'Email already exists', httpStatus.CONFLICT);
        }

        const duplicatePhoneNumber = await User.findOne({
            phoneNumber: req.body.phoneNumber
        });

        if (duplicatePhoneNumber) {
            return errorResponse(res, 'Phone number already exists', httpStatus.CONFLICT);
        }
        const hashPassword = await bcrypt.hash(req.body.password, 10);
        const user = await User.create({
            ...registrationData,
            password: hashPassword,

        });

        return successResponseLogin(res, 'Account created successfully', httpStatus.CREATED, user, {});

    } catch (error) {
        console.log(error);
    }
}


export const getOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const findUser = await User.findOne({ $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }] });
        if (!findUser) {
            return errorResponse(res, 'User not found', httpStatus.NOT_FOUND);
        }
        const { otp, otp_expiry } = GenerateOtp();
        const updateOtp = await Otp.findOneAndUpdate(
            { userId: findUser._id },
            { otp, otp_expiry },
            { upsert: true, new: true }
        );
        const mailOptions = {
            from: fromUser,
            to: findUser?.email,
            subject: 'Account Verification',
            html: htmlTemplate(otp),
        };
        updateOtp?.save();

        await mailer.sendEmail(mailOptions.from, mailOptions.to, mailOptions.subject, mailOptions.html);

        return successResponse(res, 'OTP sent successfully', httpStatus.OK, {});


    } catch (error) {
        console.log(error);
    }
}

export const verifyOtp = async (req: Request, res: Response, next: NextFunction) => {
    const { otp } = req.body;
    try {
        const otpFound = await Otp.findOne({ otp: otp });

        if (!otpFound) {
            return errorResponse(res, 'Email not found', httpStatus.NOT_FOUND);
        }

        if (otpFound.otp !== otp) {
            return errorResponse(res, 'Invalid OTP', httpStatus.BAD_REQUEST);
        }
        const currentTime = new Date();
        if (currentTime > otpFound.otp_expiry) {
            return errorResponse(res, 'OTP expired', httpStatus.BAD_REQUEST);
        }

        const checkUser = await User.findById(otpFound.userId);
        if (!checkUser) {
            return errorResponse(res, 'User not found', httpStatus.NOT_FOUND);
        }

        if (checkUser.isVerified) {
            return errorResponse(res, 'User already verified', httpStatus.CONFLICT);
        }

        const updateUser = await User.findByIdAndUpdate(checkUser._id, { isVerified: true }, { new: true });

        return successResponse(res, 'OTP verified successfully', httpStatus.OK, updateUser);

    } catch (error) {
        console.log(error);
    }
}



export const userLogin = async (req: Request, res: Response, next: NextFunction) => {
    const { password } = req.body;
    try {
        const user = await User.findOne({ email: req.body.email, isVerified: true });

        if (!user) {
            return errorResponse(res, 'Incorrect credential', httpStatus.NOT_FOUND);
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return errorResponse(res, 'Incorrect credential supplied', httpStatus.UNAUTHORIZED);
        }

        const token = generateLoginToken({ _id: user._id, email: req.body.email });

        return successResponseLogin(res, 'Login successful', httpStatus.OK, user, token);

    } catch (error) {
        console.log(error);
    }


}


export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!user) {
            return errorResponse(res, 'Email not found', httpStatus.NOT_FOUND);
        }

        const { otp, otp_expiry } = GenerateOtp();
        const updateOtp = await Otp.findOneAndUpdate(
            { userId: user._id },
            { otp, otp_expiry },
            { upsert: true, new: true }
        );
        const mailOptions = {
            from: fromUser,
            to: user?.email,
            subject: 'Password Reset',
            html: htmlTemplate(otp),
        };
        updateOtp?.save();

        await mailer.sendEmail(mailOptions.from, mailOptions.to, mailOptions.subject, mailOptions.html);

        return successResponse(res, 'OTP sent successfully, please check your mail', httpStatus.OK, {});

    } catch (error) {
        console.log(error);
    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    const { otp, password } = req.body;
    try {
        const otpFound = await Otp.findOne({ otp });

        if (!otpFound) {
            return errorResponse(res, 'Email not found', httpStatus.NOT_FOUND);
        }

        if (otpFound.otp !== otp) {
            return errorResponse(res, 'Invalid OTP', httpStatus.BAD_REQUEST);
        }
        const currentTime = new Date();
        if (currentTime > otpFound.otp_expiry) {
            return errorResponse(res, 'OTP expired', httpStatus.BAD_REQUEST);
        }

        const checkUser = await User.findById(otpFound.userId);
        if (!checkUser) {
            return errorResponse(res, 'User not found', httpStatus.NOT_FOUND);
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const updateUser = await User.findByIdAndUpdate(checkUser._id, { password: hashPassword }, { new: true });
        return successResponse(res, 'Password reset successful', httpStatus.OK, updateUser);

    } catch (error) {
        console.log(error);
    }

}

export const updateProfilePicture = (res: Response, req: Request, next: NextFunction) => {


}