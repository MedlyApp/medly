import { CommentT, Post } from "../models/postSchema";
import { Request, Response } from 'express';
import { uploadFile } from "../middlewares/cloudinary";
import { User } from "../models/userSchema";
import mongoose from 'mongoose';
import httpStatus from 'http-status';
import { errorResponse, successResponse, successResponseLogin } from '../utills/helperMethods';
import jwt from 'jsonwebtoken';
const jwtsecret = process.env.JWT_SECRET as string;
const fromUser = process.env.FROM as string;
interface jwtPayload {
    email: string;
    _id: mongoose.Types.ObjectId;
}


export const createPosts = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;

        const user = await User.findOne({ _id });
        if (!user) {
            return errorResponse(res, 'User not found', httpStatus.NOT_FOUND);
        }

        const { content, image, video, file } = req.body;
        const images: string[] = [];
        const videos: string[] = [];
        const files: string[] = [];
        let fileUrls: string[] = [];

        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };

            if (files.image && Array.isArray(files.image)) {
                for (const img of files.image) {
                    const imagePath = img.path;
                    const uploadResult = await uploadFile(imagePath, _id.toString(), 'image');

                    if (uploadResult.secure_url) {
                        images.push(uploadResult.secure_url);
                    } else {
                        return res.status(400).json({ Error: 'Error uploading the image' });
                    }
                }
            }

            if (files.video && Array.isArray(files.video)) {
                for (const vid of files.video) {
                    const videoPath = vid.path;
                    const uploadResult = await uploadFile(videoPath, _id.toString(), 'video');

                    if (uploadResult.secure_url) {
                        videos.push(uploadResult.secure_url);
                    } else {
                        return res.status(400).json({ Error: 'Error uploading the video' });
                    }
                }
            }

            if (files.file && Array.isArray(files.file)) {
                for (const f of files.file) {
                    const filePath = f.path;
                    const uploadResult = await uploadFile(filePath, _id.toString(), 'file');

                    if (uploadResult.secure_url) {
                        fileUrls.push(uploadResult.secure_url);
                    } else {
                        return res.status(400).json({ Error: 'Error uploading the file' });
                    }
                }
            }
        }

        const post = new Post({
            content: content,
            fullName: user.firstName + ' ' + user.lastName,
            profilePicture: user.profilePicture,
            userId: user._id,
            image: images,
            video: videos,
            file: fileUrls,
        });

        const savedPost = await post.save();
        return successResponse(res, 'Post created successfully', httpStatus.CREATED, savedPost);
    } catch (error) {
        console.log(error);
        return errorResponse(res, 'An error occurred while creating the post', httpStatus.INTERNAL_SERVER_ERROR);
    }
};






export const replyPost = async (req: Request, res: Response): Promise<unknown> => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;

        const user = await User.findOne({ _id });
        if (!user) {
            return errorResponse(res, 'User not found', httpStatus.NOT_FOUND);
        }
        const post = await Post.findOne({ _id: req.params.id });
        if (!post) {
            return errorResponse(res, 'Post not found', httpStatus.NOT_FOUND);
        }

        const reply = new CommentT({
            postId: post._id,
            body: req.body.body,
            createdBy: user._id,
            profileImage: user.profilePicture,
        });

        const savedReply = await reply.save();
        await reply.save();
        post.comments?.push(savedReply._id);
        post.commentCount = post.comments!.length;
        await post.save();
        return successResponse(res, 'Reply created successfully', httpStatus.CREATED, savedReply);

    } catch (error) {
        console.log(error)
    }
}