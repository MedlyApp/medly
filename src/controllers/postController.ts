import { CommentT, Post } from "../models/postSchema";
import { PostInterface } from "../utills/interfaces";
import { Request, Response } from 'express';
import { v2 as cloudinary } from "cloudinary";
import { uploadToCloudinary } from '../utills/newCloud';
import { User, UserInterface } from "../models/userSchema";
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
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;

        const user = await User.findOne({ _id });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });
        }


        const { content, postType, visibleTo }: PostInterface = req.body;

        let visibleToUsers: mongoose.Types.ObjectId[] = [];
        let lastUpdateTime = 0;

        async function updateVisibleToUsers() {
            try {
                const currentTime = Date.now();
                const users = await User.find({ isVerified: true, createdAt: { $gt: lastUpdateTime } });

                const verifiedUserIds = users.map((member) => member._id);
                visibleToUsers = [...visibleToUsers, ...verifiedUserIds];
                lastUpdateTime = currentTime;
            } catch (error) {
                console.error('Error updating visibleToUsers:', error);
            }
        }

        await updateVisibleToUsers();
        const updateInterval = 5000;
        setInterval(updateVisibleToUsers, updateInterval);


        const imageUploadPromises: Promise<string>[] = [];
        const videoUploadPromises: Promise<string>[] = [];
        const audioUploadPromises: Promise<string>[] = [];
        const fileUploadPromises: Promise<string>[] = [];

        const filesWithImage: { image?: Express.Multer.File[] } = req.files as { image?: Express.Multer.File[] };
        const filesWithVideo: { video?: Express.Multer.File[] } = req.files as { video?: Express.Multer.File[] };
        const filesWithAudio: { audio?: Express.Multer.File[] } = req.files as { audio?: Express.Multer.File[] };
        const filesWithFiles: { files?: Express.Multer.File[] } = req.files as { files?: Express.Multer.File[] };
        if (Array.isArray(filesWithImage.image) && filesWithImage.image.length > 0) {
            filesWithImage.image.forEach((file) => {
                const imageUploadPromise = uploadToCloudinary(file, 'image');
                imageUploadPromises.push(imageUploadPromise);
            });
        }

        if (filesWithVideo && filesWithVideo.video) {
            const videoUploadPromise = uploadToCloudinary(filesWithVideo.video[0], 'video');
            videoUploadPromises.push(videoUploadPromise);
        }


        if (filesWithAudio && Array.isArray(filesWithAudio.audio) && filesWithAudio.audio.length > 0) {
            filesWithAudio.audio.forEach((file) => {
                const audioUploadPromise = uploadToCloudinary(file, 'audio');
                audioUploadPromises.push(audioUploadPromise);
            });
        }

        if (filesWithFiles && Array.isArray(filesWithFiles.files) && filesWithFiles.files.length > 0) {
            filesWithFiles.files.forEach((file) => {
                const fileUploadPromise = uploadToCloudinary(file, 'raw');
                fileUploadPromises.push(fileUploadPromise);
            });
        }


        try {
            const [imageUrls, videoUrls, audioUrls, fileUrls] = await Promise.all([Promise.all(imageUploadPromises), Promise.all(videoUploadPromises), Promise.all(audioUploadPromises), Promise.all(fileUploadPromises)]);
            const post = await Post.create({
                userId: user._id,
                fullName: user.firstName + ' ' + user.lastName,
                content,
                image: imageUrls,
                audio: audioUrls,
                video: videoUrls[0],
                file: fileUrls,
                visibleTo: visibleToUsers,
                postType: postType
            });
            return res.status(httpStatus.CREATED).json({ post });
        } catch (error) {
            console.error(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error creating post' });
        }
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

export const createVideoPost = async (req: Request, res: Response) => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;

        const user = await User.findOne({ _id });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });
        }

        const { content, postType, visibleTo }: PostInterface = req.body;

        const videoUploadPromises: Promise<string>[] = [];
        const filesWithVideo: { video?: Express.Multer.File[] } = req.files as { video?: Express.Multer.File[] };
        // if (!filesWithVideo) {
        //     return res.status(httpStatus.BAD_REQUEST).json({ message: 'Provide only video' });
        // }
        if (filesWithVideo && filesWithVideo.video) {
            const videoUploadPromise = uploadToCloudinary(filesWithVideo.video[0], 'video');
            videoUploadPromises.push(videoUploadPromise);
        }


        try {
            const videoUrls = await Promise.all(videoUploadPromises);
            const post = await Post.create({
                userId: user._id,
                fullName: user.firstName + ' ' + user.lastName,
                content,
                video: videoUrls[0],
                visibleTo: visibleTo
            });
            return res.status(httpStatus.CREATED).json({ post });
        } catch (error) {
            console.error(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error creating post' });
        }
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};
export const createImagePost = async (req: Request, res: Response) => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;

        const user = await User.findOne({ _id });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });
        }

        const { content, postType, visibleTo }: PostInterface = req.body;
        const imageUploadPromises: Promise<string>[] = [];
        const filesWithImage: { image?: Express.Multer.File[] } = req.files as { image?: Express.Multer.File[] };
        console.log(filesWithImage)

        if (Array.isArray(filesWithImage.image) && filesWithImage.image.length > 0) {
            filesWithImage.image.forEach((file) => {
                const imageUploadPromise = uploadToCloudinary(file, 'image');
                imageUploadPromises.push(imageUploadPromise);
            });
        }

        try {
            const imageUrls = await Promise.all(imageUploadPromises);
            console.log(imageUrls)
            const post = await Post.create({
                userId: user._id,
                fullName: user.firstName + ' ' + user.lastName,
                content,
                image: imageUrls,
                visibleTo: visibleTo
            });
            return res.status(httpStatus.CREATED).json({ post });
        } catch (error) {
            console.error(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error creating post' });
        }
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

export const createAudioPost = async (req: Request, res: Response) => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;

        const user = await User.findOne({ _id });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });
        }

        const { content, postType, visibleTo }: PostInterface = req.body;
        const audioUploadPromises: Promise<string>[] = [];

        const filesWithAudio: { audio?: Express.Multer.File[] } = req.files as { audio?: Express.Multer.File[] };

        if (filesWithAudio && Array.isArray(filesWithAudio.audio) && filesWithAudio.audio.length > 0) {
            filesWithAudio.audio.forEach((file) => {
                const audioUploadPromise = uploadToCloudinary(file, 'audio');
                audioUploadPromises.push(audioUploadPromise);
            });
        }

        try {
            const audioUrls = await Promise.all(audioUploadPromises);
            const post = await Post.create({
                userId: user._id,
                fullName: user.firstName + ' ' + user.lastName,
                content,
                audio: audioUrls,
                visibleTo: visibleTo
            });
            return res.status(httpStatus.CREATED).json({ post });
        } catch (error) {
            console.error(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error creating post' });
        }
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

export const createFilePost = async (req: Request, res: Response) => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;

        const user = await User.findOne({ _id });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });
        }

        const { content, fullName, visibleTo }: PostInterface = req.body;
        const fileUploadPromises: Promise<string>[] = [];

        const filesWithFiles: { files?: Express.Multer.File[] } = req.files as { files?: Express.Multer.File[] };

        if (filesWithFiles && Array.isArray(filesWithFiles.files) && filesWithFiles.files.length > 0) {
            filesWithFiles.files.forEach((file) => {
                const fileUploadPromise = uploadToCloudinary(file, 'raw'); // Use 'raw' resource type for files
                fileUploadPromises.push(fileUploadPromise);
            });
        }

        try {
            const fileUrls = await Promise.all(fileUploadPromises);
            const post = await Post.create({
                userId: user._id,
                fullName: user.firstName + ' ' + user.lastName,
                content,
                files: fileUrls, // Update the field name to 'files'
                visibleTo: visibleTo
            });
            return res.status(httpStatus.CREATED).json({ post });
        } catch (error) {
            console.error(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error creating post' });
        }
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;

        const user = await User.findOne({ _id });
        if (!user) {
            return res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });
        }

        const { content, postType, visibleTo }: PostInterface = req.body;
        const imageUploadPromises: Promise<string>[] = [];
        const filesWithImage: { image?: Express.Multer.File[] } = req.files as { image?: Express.Multer.File[] };
        console.log(filesWithImage)

        if (Array.isArray(filesWithImage.image) && filesWithImage.image.length > 0) {
            filesWithImage.image.forEach((file) => {
                const imageUploadPromise = uploadToCloudinary(file, 'image');
                imageUploadPromises.push(imageUploadPromise);
            });
        }

        try {
            const imageUrls = await Promise.all(imageUploadPromises);
            const update = await User.findOne({ _id: user._id });
            if (update) {
                update.profilePicture = imageUrls.join(',');
                await update.save();
                return res.status(httpStatus.OK).json({ message: 'Profile picture updated successfully', user: update });
            }
            return res.status(httpStatus.NOT_FOUND).json({ message: 'User not found' });
        } catch (error) {
            console.error(error);
            return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Error creating post' });
        }
    } catch (error) {
        console.error(error);
        return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
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
        const imageUploadPromises: Promise<string>[] = [];
        const filesWithImage: { image?: Express.Multer.File[] } = req.files as { image?: Express.Multer.File[] };


        if (Array.isArray(filesWithImage.image) && filesWithImage.image.length > 0) {
            filesWithImage.image.forEach((file) => {
                const imageUploadPromise = uploadToCloudinary(file, 'image');
                imageUploadPromises.push(imageUploadPromise);
            });
        }
        const imageUrls = await Promise.all(imageUploadPromises);
        const reply = new CommentT({
            postId: post._id,
            body: req.body.body,
            createdBy: user._id,
            profileImage: user.profilePicture,
            image: imageUrls,
            likes: req.body.likes,
            emoji: req.body.emoji,

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


export const postLike = async (req: Request, res: Response) => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;

        const user = await User.findOne({ _id });
        if (!user) {
            return errorResponse(res, 'User not found', httpStatus.NOT_FOUND);
        }

        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (post.likes?.includes(user._id)) {
            return res.status(400).json({ success: false, message: 'User already liked the post' });
        }

        post.likes?.push(user._id);
        post.likesCount = post.likes?.length || 0;

        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to like this post', error });
    }
};

export const unlikePost = async (req: Request, res: Response) => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;

        const user = await User.findOne({ _id });
        if (!user) {
            return errorResponse(res, 'User not found', httpStatus.NOT_FOUND);
        }

        const { postId } = req.params;
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (!post.likes?.includes(user._id)) {
            return res.status(400).json({ success: false, message: 'User has not liked the post' });
        }

        const index = post.likes?.indexOf(user._id);
        if (index !== -1) {
            post.likes?.splice(index, 1);
        }

        post.likesCount = post.likes?.length || 0;

        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to unlike this post', error });
    }
};



export const replyLike = async (req: Request, res: Response) => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;

        const user = await User.findOne({ _id });
        if (!user) {
            return errorResponse(res, 'User not found', httpStatus.NOT_FOUND);
        }

        const { replyId } = req.params;
        const reply = await CommentT.findById(replyId);

        if (!reply) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (reply.likes?.includes(user._id)) {
            return res.status(400).json({ success: false, message: 'User already liked the post' });
        }

        reply.likes?.push(user._id);
        reply.likesCount = reply.likes?.length || 0;

        await reply.save();

        res.json(reply);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to like this post', error });
    }
};

export const unlikeReply = async (req: Request, res: Response) => {
    try {
        const verified = req.headers.token as string;
        const token = jwt.verify(verified, jwtsecret) as unknown as jwtPayload;
        const { _id } = token;

        const user = await User.findOne({ _id });
        if (!user) {
            return errorResponse(res, 'User not found', httpStatus.NOT_FOUND);
        }

        const { postId } = req.params;
        const post = await CommentT.findById(postId);

        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }

        if (!post.likes?.includes(user._id)) {
            return res.status(400).json({ success: false, message: 'User has not liked the post' });
        }

        const index = post.likes?.indexOf(user._id);
        if (index !== -1) {
            post.likes?.splice(index, 1);
        }

        post.likesCount = post.likes?.length || 0;

        await post.save();

        res.json(post);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to unlike this post', error });
    }
};