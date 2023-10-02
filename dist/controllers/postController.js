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
        console.log("Request body", req.files);
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return (0, helperMethods_1.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const { groupId, content, ...postData } = req.body;
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
            return (0, helperMethods_1.errorResponse)(res, 'No files uploaded', http_status_1.default.BAD_REQUEST);
        }
        if (req.files) {
            const files = req.files;
            console.log("Files", files);
            for (const fieldName in files) {
                if (Array.isArray(files[fieldName])) {
                    for (const file of files[fieldName]) {
                        const filePath = file.path;
                        console.log("File path", filePath);
                        try {
                            const uploadResult = await (0, cloudinary_1.uploadFile)(filePath, postData._id.toString(), fieldName);
                            console.log("Upload result", uploadResult);
                            // postData[fieldName].push(uploadResult);
                        }
                        catch (error) {
                            console.error(error);
                            // Handle the error by sending a response or taking appropriate action
                            return (0, helperMethods_1.errorResponse)(res, 'Error uploading file', http_status_1.default.INTERNAL_SERVER_ERROR);
                        }
                    }
                }
            }
        }
        try {
            const savedPost = await postSchema_1.Post.create(postData);
            return (0, helperMethods_1.successResponse)(res, 'Post created successfully', http_status_1.default.CREATED, savedPost);
        }
        catch (error) {
            console.log(error);
        }
    }
    catch (error) {
        console.error(error);
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