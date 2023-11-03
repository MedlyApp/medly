"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.unfollow = exports.follow = exports.updateProfile = exports.updateProfilePicture = exports.resetPassword = exports.forgotPassword = exports.userLogin = exports.verifyOtp = exports.getOtp = exports.userRegistration = void 0;
const secret = "FLWSECK_TEST-deb661e185e26c8e7e21ec97013e6a05-X";
const pub = "FLWPUBK_TEST-661f207a8c29b8711c34bbfa944b5497-X";
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(`${pub}`, `${secret}`);
const userSchema_1 = require("../models/userSchema");
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const newCloud_1 = require("../utills/newCloud");
const userProfile_1 = require("../models/userProfile");
const helperMethods_1 = require("../utills/helperMethods");
const helperMethods_2 = require("../utills/helperMethods");
const sendMail_1 = __importDefault(require("../mailers/sendMail"));
const otpSchema_1 = require("../models/otpSchema");
const mailTemplate_1 = require("../mailers/mailTemplate");
const jwtsecret = process.env.JWT_SECRET;
const fromUser = process.env.FROM;
const userRegistration = async (req, res, next) => {
    const registrationData = req.body;
    try {
        const duplicateEmail = await userSchema_1.User.findOne({ email: req.body.email });
        if (duplicateEmail) {
            return (0, helperMethods_2.errorResponse)(res, 'Email already exists', http_status_1.default.CONFLICT);
        }
        const duplicatePhoneNumber = await userSchema_1.User.findOne({
            phoneNumber: req.body.phoneNumber
        });
        if (duplicatePhoneNumber) {
            return (0, helperMethods_2.errorResponse)(res, 'Phone number already exists', http_status_1.default.CONFLICT);
        }
        const hashPassword = await bcryptjs_1.default.hash(req.body.password, 10);
        const user = await userSchema_1.User.create({
            ...registrationData,
            password: hashPassword,
        });
        if (user) {
            const payloadYearly = {
                name: "Yearly Plan",
                interval: "yearly",
                currency: "NGN",
            };
            const result = await flw.PaymentPlan.create(payloadYearly);
            const yearlyPlan = result.data;
            console.log({ Yearly: yearlyPlan });
        }
        return (0, helperMethods_2.successResponseLogin)(res, 'Account created successfully', http_status_1.default.CREATED, user, {});
    }
    catch (error) {
        console.log(error);
    }
};
exports.userRegistration = userRegistration;
const getOtp = async (req, res, next) => {
    try {
        const findUser = await userSchema_1.User.findOne({ $or: [{ email: req.body.email }, { phoneNumber: req.body.phoneNumber }] });
        if (!findUser) {
            return (0, helperMethods_2.errorResponse)(res, 'User credential not found', http_status_1.default.NOT_FOUND);
        }
        if (findUser.isVerified) {
            return (0, helperMethods_2.errorResponse)(res, 'User already verified', http_status_1.default.CONFLICT);
        }
        const convert = findUser.toJSON();
        const { otp, otp_expiry } = (0, mailTemplate_1.GenerateOtp)();
        const updateOtp = await otpSchema_1.Otp.findOneAndUpdate({ userId: findUser._id }, { otp, otp_expiry }, { upsert: true, new: true });
        const mailOptions = {
            from: fromUser,
            to: findUser === null || findUser === void 0 ? void 0 : findUser.email,
            subject: 'Account Verification',
            html: (0, mailTemplate_1.htmlTemplate)(otp),
        };
        updateOtp === null || updateOtp === void 0 ? void 0 : updateOtp.save();
        await sendMail_1.default.sendEmail(mailOptions.from, mailOptions.to, mailOptions.subject, mailOptions.html);
        // sendSms(convert.phoneNumber, `Your OTP is ${otp}`);
        return (0, helperMethods_2.successResponse)(res, 'OTP sent successfully', http_status_1.default.OK, {});
    }
    catch (error) {
        console.log(error);
    }
};
exports.getOtp = getOtp;
const verifyOtp = async (req, res, next) => {
    const { otp } = req.body;
    try {
        const otpFound = await otpSchema_1.Otp.findOne({ otp: otp });
        if (!otpFound) {
            return (0, helperMethods_2.errorResponse)(res, 'Email not found', http_status_1.default.NOT_FOUND);
        }
        if (otpFound.otp !== otp) {
            return (0, helperMethods_2.errorResponse)(res, 'Invalid OTP', http_status_1.default.BAD_REQUEST);
        }
        const currentTime = new Date();
        if (currentTime > otpFound.otp_expiry) {
            return (0, helperMethods_2.errorResponse)(res, 'OTP expired', http_status_1.default.BAD_REQUEST);
        }
        const checkUser = await userSchema_1.User.findById(otpFound.userId);
        if (!checkUser) {
            return (0, helperMethods_2.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        if (checkUser.isVerified) {
            return (0, helperMethods_2.errorResponse)(res, 'User already verified', http_status_1.default.CONFLICT);
        }
        const updateUser = await userSchema_1.User.findByIdAndUpdate(checkUser._id, { isVerified: true }, { new: true });
        return (0, helperMethods_2.successResponse)(res, 'OTP verified successfully', http_status_1.default.OK, updateUser);
    }
    catch (error) {
        console.log(error);
    }
};
exports.verifyOtp = verifyOtp;
const userLogin = async (req, res, next) => {
    const { password } = req.body;
    try {
        const user = await userSchema_1.User.findOne({ email: req.body.email, isVerified: true });
        if (!user) {
            return (0, helperMethods_2.errorResponse)(res, 'Incorrect credential', http_status_1.default.NOT_FOUND);
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            return (0, helperMethods_2.errorResponse)(res, 'Incorrect credential supplied', http_status_1.default.UNAUTHORIZED);
        }
        const token = (0, helperMethods_1.generateLoginToken)({ _id: user._id, email: req.body.email });
        return (0, helperMethods_2.successResponseLogin)(res, 'Login successful', http_status_1.default.OK, user, token);
    }
    catch (error) {
        console.log(error);
    }
};
exports.userLogin = userLogin;
const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    try {
        const user = await userSchema_1.User.findOne({ email });
        if (!user) {
            return (0, helperMethods_2.errorResponse)(res, 'Email not found', http_status_1.default.NOT_FOUND);
        }
        const { otp, otp_expiry } = (0, mailTemplate_1.GenerateOtp)();
        const updateOtp = await otpSchema_1.Otp.findOneAndUpdate({ userId: user._id }, { otp, otp_expiry }, { upsert: true, new: true });
        const mailOptions = {
            from: fromUser,
            to: user === null || user === void 0 ? void 0 : user.email,
            subject: 'Password Reset',
            html: (0, mailTemplate_1.htmlTemplate)(otp),
        };
        updateOtp === null || updateOtp === void 0 ? void 0 : updateOtp.save();
        await sendMail_1.default.sendEmail(mailOptions.from, mailOptions.to, mailOptions.subject, mailOptions.html);
        return (0, helperMethods_2.successResponse)(res, 'OTP sent successfully, please check your mail', http_status_1.default.OK, {});
    }
    catch (error) {
        console.log(error);
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res, next) => {
    const { otp, password } = req.body;
    try {
        const otpFound = await otpSchema_1.Otp.findOne({ otp });
        if (!otpFound) {
            return (0, helperMethods_2.errorResponse)(res, 'No detail found for this otp ', http_status_1.default.NOT_FOUND);
        }
        if (otpFound.otp !== otp) {
            return (0, helperMethods_2.errorResponse)(res, 'Invalid OTP', http_status_1.default.BAD_REQUEST);
        }
        const currentTime = new Date();
        if (currentTime > otpFound.otp_expiry) {
            return (0, helperMethods_2.errorResponse)(res, 'OTP expired', http_status_1.default.BAD_REQUEST);
        }
        const checkUser = await userSchema_1.User.findById(otpFound.userId);
        if (!checkUser) {
            return (0, helperMethods_2.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const hashPassword = await bcryptjs_1.default.hash(password, 10);
        const updateUser = await userSchema_1.User.findByIdAndUpdate(checkUser._id, { password: hashPassword }, { new: true });
        return (0, helperMethods_2.successResponse)(res, 'Password reset successful', http_status_1.default.OK, updateUser);
    }
    catch (error) {
        console.log(error);
    }
};
exports.resetPassword = resetPassword;
const updateProfilePicture = async (req, res, next) => {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return (0, helperMethods_2.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const { profilePicture } = req.body;
        const imageUploadPromises = [];
        const filesWithImage = req.files;
        console.log("File eith image", filesWithImage);
        if (Array.isArray(filesWithImage.image) && filesWithImage.image.length > 0) {
            filesWithImage.image.forEach((file) => {
                const imageUploadPromise = (0, newCloud_1.uploadToCloudinary)(file, 'image');
                imageUploadPromises.push(imageUploadPromise);
                console.log("Image upload promise", imageUploadPromise);
            });
        }
        const imageUrls = await Promise.all(imageUploadPromises);
        const update = await userSchema_1.User.findByIdAndUpdate(user._id, { profilePicture: imageUrls }, { new: true });
        return res.status(http_status_1.default.OK).json({
            message: 'Profile picture updated successfully', user: update
        });
    }
    catch (error) {
        console.error(error);
        return (0, helperMethods_2.errorResponse)(res, 'An error occurred while updating the profile picture', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
};
exports.updateProfilePicture = updateProfilePicture;
const updateProfile = async (req, res, next) => {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return (0, helperMethods_2.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const update = await userProfile_1.Profile.findOneAndUpdate({ userId: user._id }, { ...req.body }, { new: true });
        if (!update) {
            const create = await userProfile_1.Profile.create({
                ...req.body,
                userId: user === null || user === void 0 ? void 0 : user._id.toString()
            });
            return res.status(http_status_1.default.OK).json({
                message: 'Profile created successfully', user: create
            });
        }
        return res.status(http_status_1.default.OK).json({
            message: 'Profile updated successfully', user: update, profile: user
        });
    }
    catch (error) {
        console.error(error);
        return (0, helperMethods_2.errorResponse)(res, 'An error occurred while updating the profile picture', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
};
exports.updateProfile = updateProfile;
const follow = async (req, res, next) => {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return (0, helperMethods_2.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const { userId } = req.body;
        const findUser = await userSchema_1.User.findOne({ _id: userId });
        if (!findUser) {
            return (0, helperMethods_2.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const check = findUser.followers.includes(user._id);
        if (check) {
            return (0, helperMethods_2.errorResponse)(res, 'You already following the user', http_status_1.default.CONFLICT);
        }
        const update = await userSchema_1.User.findByIdAndUpdate(findUser._id, { $push: { followers: user._id } }, { new: true });
        if (!update) {
            return (0, helperMethods_2.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        if (update) {
            const follower = await userSchema_1.User.findByIdAndUpdate(user._id, { $push: { following: user._id } }, { new: true });
        }
        return res.status(http_status_1.default.OK).json({
            message: 'Follow successful', user: update
        });
    }
    catch (error) {
        console.error(error);
        return (0, helperMethods_2.errorResponse)(res, 'An error occurred while updating the profile picture', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
};
exports.follow = follow;
const unfollow = async (req, res, next) => {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return (0, helperMethods_2.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const { userId } = req.body;
        const findUser = await userSchema_1.User.findOne({ _id: userId });
        if (!findUser) {
            return (0, helperMethods_2.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const check = findUser.followers.includes(user._id);
        if (!check) {
            return (0, helperMethods_2.errorResponse)(res, 'You have not started following each other', http_status_1.default.CONFLICT);
        }
        const update = await userSchema_1.User.findByIdAndUpdate(findUser._id, { $pull: { followers: user._id } }, { new: true });
        await userSchema_1.User.findByIdAndUpdate(user._id, { $pull: { following: user._id } }, { new: true });
        if (!update) {
            return (0, helperMethods_2.errorResponse)(res, 'User cannot be unfollwed', http_status_1.default.NOT_FOUND);
        }
        return res.status(http_status_1.default.OK).json({
            message: 'Unfollow successful', user: update
        });
    }
    catch (error) {
        console.error(error);
        return (0, helperMethods_2.errorResponse)(res, 'An error occurred while updating the profile picture', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
};
exports.unfollow = unfollow;
const getUserProfile = async (req, res, next) => {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return (0, helperMethods_2.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const findProfile = await userProfile_1.Profile.findOne({ userId: user._id });
        const allData = {
            ...user.toJSON(),
            profile: findProfile
        };
        return res.status(http_status_1.default.OK).json({
            message: 'User Profile', user: allData
        });
    }
    catch (error) {
        console.error(error);
        return (0, helperMethods_2.errorResponse)(res, 'An error occurred', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
};
exports.getUserProfile = getUserProfile;
//# sourceMappingURL=userController.js.map