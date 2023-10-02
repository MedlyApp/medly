"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = exports.upload = void 0;
const streamifier_1 = __importDefault(require("streamifier"));
const postSchema_1 = require("../models/postSchema");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const express_1 = __importDefault(require("express"));
const userSchema_1 = require("../models/userSchema");
const http_status_1 = __importDefault(require("http-status"));
const helperMethods_1 = require("../utills/helperMethods");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtsecret = process.env.JWT_SECRET;
const fromUser = process.env.FROM;
const router = express_1.default.Router();
const storage = multer_1.default.memoryStorage(); // Store files in memory
exports.upload = (0, multer_1.default)({ storage });
cloudinary_1.v2.config({
    cloud_name: 'dwlkyt8w0',
    api_key: '432296571787281',
    api_secret: 'koZZQsTDHvfdYuBnIBLfFljabwA'
});
const imageStorage = multer_1.default.memoryStorage();
const imageUpload = (0, multer_1.default)({ storage: imageStorage });
const videoStorage = multer_1.default.memoryStorage();
const videoUpload = (0, multer_1.default)({ storage: videoStorage });
const uploadToCloudinary = async (file, resourceType) => {
    const fileStream = streamifier_1.default.createReadStream(file.buffer);
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ resource_type: resourceType }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                const secureUrl = result === null || result === void 0 ? void 0 : result.secure_url;
                if (secureUrl) {
                    resolve(secureUrl);
                }
                else {
                    reject(new Error('Error uploading file to Cloudinary'));
                }
            }
        });
        fileStream.pipe(uploadStream);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
const handleFileUpload = async (req, user) => {
    const files = req.files;
    console.log("Files", files);
    if (!files || files.length === 0) {
        return []; // Return an empty array if no files are uploaded
    }
    const uploadedUrls = await Promise.all(files.map(async (file) => {
        const resourceType = file.fieldname === 'image' ? 'auto' : 'video';
        return (0, exports.uploadToCloudinary)(file, resourceType);
    }));
    return uploadedUrls.filter((url) => url !== '');
};
router.post('/create/post', async (req, res) => {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return (0, helperMethods_1.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const imageUploadMiddleware = imageUpload.array('image', 5);
        const videoUploadMiddleware = videoUpload.single('video');
        console.
            if((Array.isArray(req.files)) && req.files.length === 0);
        {
            // Request contains images, use imageUploadMiddleware
            imageUploadMiddleware(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ message: 'Error uploading images' });
                }
                const uploadedUrls = await handleFileUpload(req, user);
                console.log('uploadedUrls', uploadedUrls);
                // Create a new post with uploaded image URLs (replace with your schema)
                const newPost = new postSchema_1.Post({
                    userId: user._id,
                    content: req.body.content,
                    image: req.body.image ? uploadedUrls.filter((url) => url !== null && url !== '') : [],
                });
                // Save the post to the database
                await newPost.save();
                return res.status(201).json(newPost);
            });
        }
        if (req.file) {
            // Request contains a video, use videoUploadMiddleware
            videoUploadMiddleware(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ message: 'Error uploading video' });
                }
                const videoUrl = await handleFileUpload(req, user);
                if (!videoUrl || videoUrl.length === 0) {
                    return res.status(500).json({ message: 'Error uploading video to Cloudinary' });
                }
                // Create a new post with the video URL (replace with your schema)
                const newPost = new postSchema_1.Post({
                    userId: user._id,
                    content: req.body.content,
                    video: req.body.video ? videoUrl : [],
                });
                // Save the post to the database
                await newPost.save();
                return res.status(201).json(newPost);
            });
        }
        else {
            return res.status(400).json({ message: 'No file uploaded' });
        }
    }
    catch (error) {
        return (0, helperMethods_1.errorResponse)(res, error.message, http_status_1.default.INTERNAL_SERVER_ERROR);
    }
});
exports.default = router;
// import express, { Request, Response } from 'express';
// import { CommentT, Post } from "../models/postSchema";
// import { uploadFile } from "../middlewares/cloudinary";
// import { User } from "../models/userSchema";
// import mongoose from 'mongoose';
// import httpStatus from 'http-status';
// import { errorResponse, successResponse, successResponseLogin } from '../utills/helperMethods';
// import jwt from 'jsonwebtoken';
// const jwtsecret = process.env.JWT_SECRET as string;
// const fromUser = process.env.FROM as string;
// interface jwtPayload {
//     email: string;
//     _id: mongoose.Types.ObjectId;
// }
// import { v2 as cloudinary, } from "cloudinary";
// import multer from "multer";
// import { CloudinaryStorage, Options as CloudinaryStorageOptions } from "multer-storage-cloudinary";
// import { PostInterface } from '../utills/interfaces'; // Import the PostAttributes interface from your model
// import dotenv from "dotenv";
// dotenv.config();
// cloudinary.config({
//     cloud_name: 'dwlkyt8w0',
//     api_key: '432296571787281',
//     api_secret: 'koZZQsTDHvfdYuBnIBLfFljabwA'
// });
// interface CustomCloudinaryStorageOptions extends CloudinaryStorageOptions {
//     allowed_formats?: string[];
// }
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         transformation: [{ width: 1000, height: 1000, crop: "limit" }],
//         allowed_formats: ['jpg', 'png', 'gif', 'mp4', 'avi', 'mov', 'pdf', 'doc', 'docx', 'xls', 'xlsx'],
//         folder: 'posts',
//         allowedFieldNames: ["image", "video", "file"]
//     },
// } as CustomCloudinaryStorageOptions);
// const parser = multer({ storage: storage });
// const router = express.Router();
// router.post('/create/post', parser.single('video'), async (req: Request, res: Response) => {
//     try {
//         const verified = req.headers.token as string;
//         const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
//         const { _id } = token;
//         const user = await User.findOne({ _id });
//         if (!user) {
//             return errorResponse(res, 'User not found', httpStatus.NOT_FOUND);
//         }
//         const { ...postData } = req.body;
//         const { file } = req;
//         console.log(file);
//         if (!file) {
//             throw new Error('No file uploaded');
//         }
//         const { path } = file;
//         const { secure_url } = await cloudinary.uploader.upload(path);
//         postData.image = secure_url;
//         postData.video = secure_url;
//         const post = new Post({
//             userId: user._id,
//             content: postData.content,
//             image: postData.image.secure_url,
//             video: postData.video,
//             file: postData.file,
//             fullName: postData.fullName,
//         });
//         // Save the post to the database
//         const savedPost = await post.save();
//         return successResponse(res, 'Post created successfully', httpStatus.CREATED, savedPost);
//     } catch (error) {
//         console.log(error);
//         return res.status(500).json({ error });
//     }
// });
// export default router;
// // router.post('/create/post', async (req: Request, res: Response) => {
// //     try {
// //         const verified = req.headers.token as string;
// //         const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
// //         const { _id } = token;
// //         const user = await User.findOne({ _id });
// //         if (!user) {
// //             return errorResponse(res, 'User not found', httpStatus.NOT_FOUND);
// //         }
// //         const { ...postData } = req.body;
// //         const uploadId = req.user
// //         console.log("uploadId", uploadId);
// //         parser.fields([{ name: 'image', maxCount: 1 }, { name: 'video', maxCount: 1 }, { name: 'file', maxCount: 1 }]);
// //         const url = req.file?.path as string;
// //         const result = await cloudinary.uploader.upload(url);
// //         if (!result) {
// //             return res.status(400).json({ message: 'Image not uploaded' });
// //         }
// //         postData.image = result.secure_url;
// //         postData.video = result.secure_url;
// //         postData.file = result.secure_url;
// //         const post = new Post({
// //             userId: user._id,
// //             content: postData.content,
// //             image: postData.image,
// //             video: postData.video,
// //             file: postData.file,
// //             fullName: postData.fullName,
// //         });
// //         // Save the post to the database
// //         const savedPost = await post.save();
// //         return successResponse(res, 'Post created successfully', httpStatus.CREATED, savedPost);
// //     } catch (error) {
// //         console.log(error);
// //         return res.status(500).json({ error });
// //     }
// // });
// // export default router;
// // const router = express.Router();
// // // Configure Cloudinary
// // cloudinary.config({
// //     cloud_name: 'dwlkyt8w0',
// //     api_key: '432296571787281',
// //     api_secret: 'koZZQsTDHvfdYuBnIBLfFljabwA',
// // });
// // // Configure multer storage for file uploads
// // const storage = multer.memoryStorage();
// // const parser = multer({ storage: storage });
// // // Route for creating a post with file uploads
// // router.post('/create/post', parser.fields([
// //     { name: 'image', maxCount: 1 },
// //     { name: 'video', maxCount: 1 },
// //     { name: 'file', maxCount: 1 }
// // ]), async (req, res) => {
// //     try {
// //         // Verify the JWT token and get user information
// //         const verified = req.headers.token as string;
// //         const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
// //         const { _id } = token;
// //         const user = await User.findOne({ _id });
// //         if (!user) {
// //             return res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });
// //         }
// //         // Process uploaded files
// //         const postData = req.body;
// //         if (!req.files || Object.keys(req.files).length === 0) {
// //             return res.status(httpStatus.BAD_REQUEST).json({ message: 'No files uploaded' });
// //         }
// //         const imageFile = req.files['image'] ? req.files['image'][0] : null;
// //         const videoFile = req.files['video'] ? req.files['video'][0] : null;
// //         const fileFile = req.files['file'] ? req.files['file'][0] : null;
// //         // Upload files to Cloudinary
// //         const uploadPromises = [];
// //         const cloudinaryResponses = {};
// //         if (imageFile) {
// //             uploadPromises.push(uploadFileToCloudinary(imageFile, 'image'));
// //         }
// //         if (videoFile) {
// //             uploadPromises.push(uploadFileToCloudinary(videoFile, 'video'));
// //         }
// //         if (fileFile) {
// //             uploadPromises.push(uploadFileToCloudinary(fileFile, 'file'));
// //         }
// //         if (uploadPromises.length === 0) {
// //             return res.status(httpStatus.BAD_REQUEST).json({ message: 'No valid files uploaded' });
// //         }
// //         const uploadResults = await Promise.all(uploadPromises);
// //         // Store Cloudinary URLs in postData
// //         if (imageFile) {
// //             cloudinaryResponses['image'] = uploadResults.shift();
// //             postData.image = cloudinaryResponses['image'].secure_url;
// //         }
// //         if (videoFile) {
// //             cloudinaryResponses['video'] = uploadResults.shift();
// //             postData.video = cloudinaryResponses['video'].secure_url;
// //         }
// //         if (fileFile) {
// //             cloudinaryResponses['file'] = uploadResults.shift();
// //             postData.file = cloudinaryResponses['file'].secure_url;
// //         }
// //         // Create a new post and save it to the database
// //         const post = new Post({
// //             userId: user._id,
// //             content: postData.content,
// //             image: postData.image,
// //             video: postData.video,
// //             file: postData.file,
// //             fullName: postData.fullName,
// //         });
// //         const savedPost = await post.save();
// //         return res.status(httpStatus.CREATED).json({ message: 'Post created successfully', savedPost });
// //     } catch (error) {
// //         console.error(error);
// //         return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ error: 'An error occurred while creating the post' });
// //     }
// // });
// // // Helper function to upload a file to Cloudinary
// // const uploadFileToCloudinary = (file, resourceType) => {
// //     return new Promise((resolve, reject) => {
// //         const uploadOptions = { resource_type: resourceType };
// //         cloudinary.uploader.upload_stream(uploadOptions, (error, result) => {
// //             if (error) {
// //                 reject(error);
// //             } else {
// //                 resolve(result);
// //             }
// //         }).end(file.buffer);
// //     });
// // };
// // module.exports = router;
//# sourceMappingURL=post.js.map