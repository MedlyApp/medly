import { CommentT, Post } from "../models/postSchema";
import { UserInterface } from "../models/userSchema";
import { PostInterface } from "../utills/interfaces";
import { Request, Response } from 'express';
import { uploadFile } from '../middlewares/cloudinary';
import { upload } from '../middlewares/multer';
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



export const createPosts = async (req: Request, res: Response) => {
    try {
        console.log("Request body", req.files);
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;

        const user = await User.findOne({ _id });
        if (!user) {
            return errorResponse(res, 'User not found', httpStatus.NOT_FOUND);
        }

        const { groupId, content, ...postData }: PostInterface = req.body;

        console.log("Post data", postData);

        if (!Array.isArray(postData.image)) {
            postData.image = [];
        }

        if (!postData.video) {
            postData.video = '';
        }

        if (!Array.isArray(postData.file)) {
            postData.file = [];
        }

        postData.fullName = user.firstName + ' ' + user.lastName;
        postData.userId = user._id;
        // postData._id = _id.toString();

        if (req.files === undefined) {
            console.error('No files uploaded here');
            return errorResponse(res, 'No files uploaded', httpStatus.BAD_REQUEST);
        }

        if (req.files) {
            const files = req.files as { [fieldname: string]: Express.Multer.File[] };
            console.log("Files", files);
            for (const fieldName in files) {
                if (Array.isArray(files[fieldName])) {
                    for (const file of files[fieldName]) {
                        const filePath = file.path;
                        console.log("File path", filePath)
                        try {
                            const uploadResult = await uploadFile(filePath, postData._id.toString(), fieldName);
                            console.log("Upload result", uploadResult);
                            // postData[fieldName].push(uploadResult);
                        } catch (error) {
                            console.error(error);
                            // Handle the error by sending a response or taking appropriate action
                            return errorResponse(res, 'Error uploading file', httpStatus.INTERNAL_SERVER_ERROR);
                        }
                    }
                }
            }

        }
        try {

            const savedPost = await Post.create(postData);
            return successResponse(res, 'Post created successfully', httpStatus.CREATED, savedPost);
        } catch (error) {
            console.log(error);
        }
    } catch (error) {
        console.error(error);
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