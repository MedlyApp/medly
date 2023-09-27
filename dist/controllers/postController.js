"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.replyPost = exports.createPosts = void 0;
const postSchema_1 = require("../models/postSchema");
const cloudinary_1 = require("../middlewares/cloudinary");
const userSchema_1 = require("../models/userSchema");
const http_status_1 = __importDefault(require("http-status"));
const helperMethods_1 = require("../utills/helperMethods");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtsecret = process.env.JWT_SECRET;
const fromUser = process.env.FROM;
const createPosts = async (req, res) => {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return (0, helperMethods_1.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const { content, image, video, file } = req.body;
        const images = [];
        const videos = [];
        const files = [];
        let fileUrls = [];
        if (req.files) {
            const files = req.files;
            if (files.image && Array.isArray(files.image)) {
                for (const img of files.image) {
                    const imagePath = img.path;
                    const uploadResult = await (0, cloudinary_1.uploadFile)(imagePath, _id.toString(), 'image');
                    if (uploadResult.secure_url) {
                        images.push(uploadResult.secure_url);
                    }
                    else {
                        return res.status(400).json({ Error: 'Error uploading the image' });
                    }
                }
            }
            if (files.video && Array.isArray(files.video)) {
                for (const vid of files.video) {
                    const videoPath = vid.path;
                    const uploadResult = await (0, cloudinary_1.uploadFile)(videoPath, _id.toString(), 'video');
                    if (uploadResult.secure_url) {
                        videos.push(uploadResult.secure_url);
                    }
                    else {
                        return res.status(400).json({ Error: 'Error uploading the video' });
                    }
                }
            }
            if (files.file && Array.isArray(files.file)) {
                for (const f of files.file) {
                    const filePath = f.path;
                    const uploadResult = await (0, cloudinary_1.uploadFile)(filePath, _id.toString(), 'file');
                    if (uploadResult.secure_url) {
                        fileUrls.push(uploadResult.secure_url);
                    }
                    else {
                        return res.status(400).json({ Error: 'Error uploading the file' });
                    }
                }
            }
        }
        const post = new postSchema_1.Post({
            content: content,
            fullName: user.firstName + ' ' + user.lastName,
            profilePicture: user.profilePicture,
            userId: user._id,
            image: images,
            video: videos,
            file: fileUrls,
        });
        const savedPost = await post.save();
        return (0, helperMethods_1.successResponse)(res, 'Post created successfully', http_status_1.default.CREATED, savedPost);
    }
    catch (error) {
        console.log(error);
        return (0, helperMethods_1.errorResponse)(res, 'An error occurred while creating the post', http_status_1.default.INTERNAL_SERVER_ERROR);
    }
};
exports.createPosts = createPosts;
const replyPost = async (req, res) => {
    var _a;
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return (0, helperMethods_1.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const post = await postSchema_1.Post.findOne({ _id: req.params.id });
        if (!post) {
            return (0, helperMethods_1.errorResponse)(res, 'Post not found', http_status_1.default.NOT_FOUND);
        }
        const reply = new postSchema_1.CommentT({
            postId: post._id,
            body: req.body.body,
            createdBy: user._id,
            profileImage: user.profilePicture,
        });
        const savedReply = await reply.save();
        await reply.save();
        (_a = post.comments) === null || _a === void 0 ? void 0 : _a.push(savedReply._id);
        post.commentCount = post.comments.length;
        await post.save();
        return (0, helperMethods_1.successResponse)(res, 'Reply created successfully', http_status_1.default.CREATED, savedReply);
    }
    catch (error) {
        console.log(error);
    }
};
exports.replyPost = replyPost;
//# sourceMappingURL=postController.js.map