"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RepostT = exports.CommentT = exports.Post = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const postSchema = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Types.ObjectId, ref: "User",
        required: true,
    },
    groupId: {
        type: mongoose_1.default.Types.ObjectId, ref: "Group",
    },
    content: {
        type: String,
        required: true,
    },
    postType: {
        type: String,
        enum: ['group', 'general', 'individual'],
        required: true,
    },
    profilePicture: {
        type: String, ref: "User",
    },
    image: [
        {
            type: String,
            default: [],
        },
    ],
    audio: [
        {
            type: String,
            default: [],
        },
    ],
    video: [
        {
            type: String,
            default: [],
        },
    ],
    file: [
        {
            type: String,
        },
    ],
    fullName: { type: String, ref: "User" },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, default: [], ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    comments: [{ type: mongoose_1.Schema.Types.ObjectId, default: [], ref: 'Reply' }],
    commentCount: { type: Number, default: 0 },
    reposts: [{
            type: mongoose_1.Schema.Types.ObjectId, ref: "User",
            default: [],
        }],
    visibleTo: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "User", default: [] }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.Post = mongoose_1.default.model('Post', postSchema);
const commentSchema = new mongoose_1.default.Schema({
    postId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: "Post",
        required: true,
    },
    body: { type: String, required: true },
    createdBy: { type: String, required: true },
    profileImage: { type: String, ref: "User" },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, default: [], ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    emoji: {
        type: String, default: ""
    },
    image: [
        {
            type: String,
            default: [],
        },
    ],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.CommentT = mongoose_1.default.model('CommentT', commentSchema);
const repostSchema = new mongoose_1.default.Schema({
    postId: {
        type: mongoose_1.Schema.Types.ObjectId, ref: "Post",
        required: true,
    },
    body: { type: String, required: true },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    profileImage: { type: String, ref: "User" },
    likes: [{ type: mongoose_1.Schema.Types.ObjectId, default: [], ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    emoji: {
        type: String, default: []
    },
    image: [
        {
            type: String,
            default: [],
        },
    ],
    mediaUrls: [{ type: String, default: [], }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});
exports.RepostT = mongoose_1.default.model('RepostT', repostSchema);
//# sourceMappingURL=postSchema.js.map