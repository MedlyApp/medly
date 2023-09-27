import mongoose, { Schema, model, Model, Document, ObjectId } from 'mongoose';
import { PostInterface, Comment, Repost } from "../utills/interfaces"



const postSchema = new mongoose.Schema<PostInterface>({
    userId: {
        type: mongoose.Types.ObjectId, ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String, ref: "User",
    },
    image: [{ type: String, default: [], }],
    file: [{ type: String, default: [], }],
    video: [{ type: String, default: [], }],
    fullName: { type: String, ref: "User" },
    // mediaUrls: {
    //     type: [String],
    // },
    likes: [{ type: Schema.Types.ObjectId, default: [], ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, default: [], ref: 'Reply' }],
    commentCount: { type: Number, default: 0 },
    reposts: [{
        type: Schema.Types.ObjectId, ref: "User",
        default: [],
    }],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Post = mongoose.model<PostInterface>('Post', postSchema);

const commentSchema = new mongoose.Schema<Comment>({
    postId: {
        type: Schema.Types.ObjectId, ref: "Post",
        required: true,
    },
    body: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    profileImage: { type: String, ref: "User" },
    likes: [{ type: Schema.Types.ObjectId, default: [], ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    emoji: {
        type: String, default: ""
    },
    image: { type: String, default: "" },
    mediaUrls: [{ type: String, default: [], }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

})

export const CommentT = mongoose.model<Comment>('CommentT', commentSchema);

const repostSchema = new mongoose.Schema<Repost>({
    postId: {
        type: Schema.Types.ObjectId, ref: "Post",
        required: true,
    },
    body: { type: String, required: true },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    profileImage: { type: String, ref: "User" },
    likes: [{ type: Schema.Types.ObjectId, default: [], ref: 'User' }],
    likesCount: { type: Number, default: 0 },
    emoji: {
        type: String, default: []
    },
    image: { type: String, default: "" },
    mediaUrls: [{ type: String, default: [], }],
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
})

export const RepostT = mongoose.model<Repost>('RepostT', repostSchema);