import { User, UserInterface } from '../models/userSchema'; import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from "cloudinary";
import { uploadToCloudinary } from '../utills/newCloud';
import { userRequest } from '../types/express';
import { generateLoginToken } from '../utills/helperMethods';
import { errorResponse, successResponse, successResponseLogin } from '../utills/helperMethods';
import mailer from '../mailers/sendMail';
import { Otp } from '../models/otpSchema';
import { sendSms } from '../utills/twilio';
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
            return errorResponse(res, 'User credential not found', httpStatus.NOT_FOUND);
        }
        const convert = findUser.toJSON();
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
        // sendSms(convert.phoneNumber, `Your OTP is ${otp}`);
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
            return errorResponse(res, 'No detail found for this otp ', httpStatus.NOT_FOUND);
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

export const updateProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;
        const user = await User.findOne({ _id });
        if (!user) {
            return errorResponse(res, 'User not found', httpStatus.NOT_FOUND);
        }

        const { profilePicture } = req.body
        const imageUploadPromises: Promise<string>[] = [];
        const filesWithImage: { image?: Express.Multer.File[] } = req.files as {
            image?: Express.Multer.File[]
        };
        console.log("File eith image", filesWithImage);


        if (Array.isArray(filesWithImage.image) && filesWithImage.image.length > 0) {
            filesWithImage.image.forEach((file) => {
                const imageUploadPromise = uploadToCloudinary(file, 'image');
                imageUploadPromises.push(imageUploadPromise);
                console.log("Image upload promise", imageUploadPromise);
            });
        }
        const imageUrls = await Promise.all(imageUploadPromises);
        const update = await User.findByIdAndUpdate(user._id,
            { profilePicture: imageUrls }, { new: true });

        return res.status(httpStatus.OK).json({
            message: 'Profile picture updated successfully', user: update
        });


    } catch (error) {
        console.error(error);
        return errorResponse(
            res,
            'An error occurred while updating the profile picture',
            httpStatus.INTERNAL_SERVER_ERROR
        );
    }
}

