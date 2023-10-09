"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.unlikeReply = exports.replyLike = exports.unlikePost = exports.postLike = exports.replyPost = exports.createFilePost = exports.createAudioPost = exports.createImagePost = exports.createVideoPost = exports.createPosts = void 0;
const postSchema_1 = require("../models/postSchema");
const newCloud_1 = require("../utills/newCloud");
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
            return res.status(http_status_1.default.NOT_FOUND).json({ message: 'User not found' });
        }
        const { content, postType, visibleTo } = req.body;
        let visibleToUsers = [];
        let lastUpdateTime = 0;
        async function updateVisibleToUsers() {
            try {
                const currentTime = Date.now();
                const users = await userSchema_1.User.find({ isVerified: true, createdAt: { $gt: lastUpdateTime } });
                const verifiedUserIds = users.map((member) => member._id);
                visibleToUsers = [...visibleToUsers, ...verifiedUserIds];
                lastUpdateTime = currentTime;
            }
            catch (error) {
                console.error('Error updating visibleToUsers:', error);
            }
        }
        await updateVisibleToUsers();
        const updateInterval = 5000;
        setInterval(updateVisibleToUsers, updateInterval);
        const imageUploadPromises = [];
        const videoUploadPromises = [];
        const audioUploadPromises = [];
        const fileUploadPromises = [];
        const filesWithImage = req.files;
        const filesWithVideo = req.files;
        const filesWithAudio = req.files;
        const filesWithFiles = req.files;
        if (Array.isArray(filesWithImage.image) && filesWithImage.image.length > 0) {
            filesWithImage.image.forEach((file) => {
                const imageUploadPromise = (0, newCloud_1.uploadToCloudinary)(file, 'image');
                imageUploadPromises.push(imageUploadPromise);
            });
        }
        if (filesWithVideo && filesWithVideo.video) {
            const videoUploadPromise = (0, newCloud_1.uploadToCloudinary)(filesWithVideo.video[0], 'video');
            videoUploadPromises.push(videoUploadPromise);
        }
        if (filesWithAudio && Array.isArray(filesWithAudio.audio) && filesWithAudio.audio.length > 0) {
            filesWithAudio.audio.forEach((file) => {
                const audioUploadPromise = (0, newCloud_1.uploadToCloudinary)(file, 'audio');
                audioUploadPromises.push(audioUploadPromise);
            });
        }
        if (filesWithFiles && Array.isArray(filesWithFiles.files) && filesWithFiles.files.length > 0) {
            filesWithFiles.files.forEach((file) => {
                const fileUploadPromise = (0, newCloud_1.uploadToCloudinary)(file, 'raw');
                fileUploadPromises.push(fileUploadPromise);
            });
        }
        try {
            const [imageUrls, videoUrls, audioUrls, fileUrls] = await Promise.all([Promise.all(imageUploadPromises), Promise.all(videoUploadPromises), Promise.all(audioUploadPromises), Promise.all(fileUploadPromises)]);
            const post = await postSchema_1.Post.create({
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
            return res.status(http_status_1.default.CREATED).json({ post });
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Error creating post' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};
exports.createPosts = createPosts;
const createVideoPost = async (req, res) => {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return res.status(http_status_1.default.NOT_FOUND).json({ message: 'User not found' });
        }
        const { content, postType, visibleTo } = req.body;
        const videoUploadPromises = [];
        const filesWithVideo = req.files;
        if (!filesWithVideo) {
            return res.status(http_status_1.default.BAD_REQUEST).json({ message: 'Provide only video' });
        }
        if (filesWithVideo && filesWithVideo.video) {
            const videoUploadPromise = (0, newCloud_1.uploadToCloudinary)(filesWithVideo.video[0], 'video');
            videoUploadPromises.push(videoUploadPromise);
        }
        try {
            const videoUrls = await Promise.all(videoUploadPromises);
            const post = await postSchema_1.Post.create({
                userId: user._id,
                fullName: user.firstName + ' ' + user.lastName,
                content,
                video: videoUrls[0],
                visibleTo: visibleTo
            });
            return res.status(http_status_1.default.CREATED).json({ post });
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Error creating post' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};
exports.createVideoPost = createVideoPost;
const createImagePost = async (req, res) => {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return res.status(http_status_1.default.NOT_FOUND).json({ message: 'User not found' });
        }
        const { content, postType, visibleTo } = req.body;
        const imageUploadPromises = [];
        const filesWithImage = req.files;
        console.log(filesWithImage);
        if (Array.isArray(filesWithImage.image) && filesWithImage.image.length > 0) {
            filesWithImage.image.forEach((file) => {
                const imageUploadPromise = (0, newCloud_1.uploadToCloudinary)(file, 'image');
                imageUploadPromises.push(imageUploadPromise);
            });
        }
        try {
            const imageUrls = await Promise.all(imageUploadPromises);
            console.log(imageUrls);
            const post = await postSchema_1.Post.create({
                userId: user._id,
                fullName: user.firstName + ' ' + user.lastName,
                content,
                image: imageUrls,
                visibleTo: visibleTo
            });
            return res.status(http_status_1.default.CREATED).json({ post });
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Error creating post' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};
exports.createImagePost = createImagePost;
const createAudioPost = async (req, res) => {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return res.status(http_status_1.default.NOT_FOUND).json({ message: 'User not found' });
        }
        const { content, postType, visibleTo } = req.body;
        const audioUploadPromises = [];
        const filesWithAudio = req.files;
        if (filesWithAudio && Array.isArray(filesWithAudio.audio) && filesWithAudio.audio.length > 0) {
            filesWithAudio.audio.forEach((file) => {
                const audioUploadPromise = (0, newCloud_1.uploadToCloudinary)(file, 'audio');
                audioUploadPromises.push(audioUploadPromise);
            });
        }
        try {
            const audioUrls = await Promise.all(audioUploadPromises);
            const post = await postSchema_1.Post.create({
                userId: user._id,
                fullName: user.firstName + ' ' + user.lastName,
                content,
                audio: audioUrls,
                visibleTo: visibleTo
            });
            return res.status(http_status_1.default.CREATED).json({ post });
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Error creating post' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};
exports.createAudioPost = createAudioPost;
const createFilePost = async (req, res) => {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return res.status(http_status_1.default.NOT_FOUND).json({ message: 'User not found' });
        }
        const { content, fullName, visibleTo } = req.body;
        const fileUploadPromises = [];
        const filesWithFiles = req.files;
        if (filesWithFiles && Array.isArray(filesWithFiles.files) && filesWithFiles.files.length > 0) {
            filesWithFiles.files.forEach((file) => {
                const fileUploadPromise = (0, newCloud_1.uploadToCloudinary)(file, 'raw'); // Use 'raw' resource type for files
                fileUploadPromises.push(fileUploadPromise);
            });
        }
        try {
            const fileUrls = await Promise.all(fileUploadPromises);
            const post = await postSchema_1.Post.create({
                userId: user._id,
                fullName: user.firstName + ' ' + user.lastName,
                content,
                files: fileUrls,
                visibleTo: visibleTo
            });
            return res.status(http_status_1.default.CREATED).json({ post });
        }
        catch (error) {
            console.error(error);
            return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Error creating post' });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
    }
};
exports.createFilePost = createFilePost;
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
        const imageUploadPromises = [];
        const filesWithImage = req.files;
        if (Array.isArray(filesWithImage.image) && filesWithImage.image.length > 0) {
            filesWithImage.image.forEach((file) => {
                const imageUploadPromise = (0, newCloud_1.uploadToCloudinary)(file, 'image');
                imageUploadPromises.push(imageUploadPromise);
            });
        }
        const imageUrls = await Promise.all(imageUploadPromises);
        const reply = new postSchema_1.CommentT({
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
const postLike = async (req, res) => {
    var _a, _b, _c;
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return (0, helperMethods_1.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const { postId } = req.params;
        const post = await postSchema_1.Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        if ((_a = post.likes) === null || _a === void 0 ? void 0 : _a.includes(user._id)) {
            return res.status(400).json({ success: false, message: 'User already liked the post' });
        }
        (_b = post.likes) === null || _b === void 0 ? void 0 : _b.push(user._id);
        post.likesCount = ((_c = post.likes) === null || _c === void 0 ? void 0 : _c.length) || 0;
        await post.save();
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to like this post', error });
    }
};
exports.postLike = postLike;
const unlikePost = async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return (0, helperMethods_1.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const { postId } = req.params;
        const post = await postSchema_1.Post.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        if (!((_a = post.likes) === null || _a === void 0 ? void 0 : _a.includes(user._id))) {
            return res.status(400).json({ success: false, message: 'User has not liked the post' });
        }
        const index = (_b = post.likes) === null || _b === void 0 ? void 0 : _b.indexOf(user._id);
        if (index !== -1) {
            (_c = post.likes) === null || _c === void 0 ? void 0 : _c.splice(index, 1);
        }
        post.likesCount = ((_d = post.likes) === null || _d === void 0 ? void 0 : _d.length) || 0;
        await post.save();
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to unlike this post', error });
    }
};
exports.unlikePost = unlikePost;
const replyLike = async (req, res) => {
    var _a, _b, _c;
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return (0, helperMethods_1.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const { replyId } = req.params;
        const reply = await postSchema_1.CommentT.findById(replyId);
        if (!reply) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        if ((_a = reply.likes) === null || _a === void 0 ? void 0 : _a.includes(user._id)) {
            return res.status(400).json({ success: false, message: 'User already liked the post' });
        }
        (_b = reply.likes) === null || _b === void 0 ? void 0 : _b.push(user._id);
        reply.likesCount = ((_c = reply.likes) === null || _c === void 0 ? void 0 : _c.length) || 0;
        await reply.save();
        res.json(reply);
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to like this post', error });
    }
};
exports.replyLike = replyLike;
const unlikeReply = async (req, res) => {
    var _a, _b, _c, _d;
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { _id } = token;
        const user = await userSchema_1.User.findOne({ _id });
        if (!user) {
            return (0, helperMethods_1.errorResponse)(res, 'User not found', http_status_1.default.NOT_FOUND);
        }
        const { postId } = req.params;
        const post = await postSchema_1.CommentT.findById(postId);
        if (!post) {
            return res.status(404).json({ success: false, message: 'Post not found' });
        }
        if (!((_a = post.likes) === null || _a === void 0 ? void 0 : _a.includes(user._id))) {
            return res.status(400).json({ success: false, message: 'User has not liked the post' });
        }
        const index = (_b = post.likes) === null || _b === void 0 ? void 0 : _b.indexOf(user._id);
        if (index !== -1) {
            (_c = post.likes) === null || _c === void 0 ? void 0 : _c.splice(index, 1);
        }
        post.likesCount = ((_d = post.likes) === null || _d === void 0 ? void 0 : _d.length) || 0;
        await post.save();
        res.json(post);
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Failed to unlike this post', error });
    }
};
exports.unlikeReply = unlikeReply;
//# sourceMappingURL=postController.js.map