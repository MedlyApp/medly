import mongoose, { Document, ObjectId } from 'mongoose';

export interface PostInterface extends Document {
    userId: ObjectId;
    content: string;
    mediaUrls: string[];
    likes: ObjectId[];
    comments: {
        userId: ObjectId;
        text: string;
    }[];
    reposts: ObjectId[];
    createdAt: Date;
}

const postSchema = new mongoose.Schema<PostInterface>({
    userId: {
        type: mongoose.Types.ObjectId, ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    mediaUrls: {
        type: [String],
    },
    likes: {
        type: [mongoose.Types.ObjectId],
        default: [],
    },
    comments: [
        {
            userId: {
                type: mongoose.Types.ObjectId, ref: "User",
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
        },
    ],
    reposts: {
        type: [mongoose.Types.ObjectId], ref: "Post",
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Post = mongoose.model<PostInterface>('Post', postSchema);
