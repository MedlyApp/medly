import mongoose, { Document, Schema, Types, ObjectId } from 'mongoose';

interface Comment {
    userId: Types.ObjectId;
    text: string;
}

interface Member {
    user: ObjectId;
    status: string;
}

export interface GroupPostInterface extends Document {
    userId: ObjectId;
    groupName: string;
    aboutGroup: string;
    content: string;
    members: Member[];
    likes: ObjectId[];
    comments: Comment[];
    reposts: ObjectId[];
    createdAt: Date;
}

const groupPostSchema = new Schema<GroupPostInterface>({
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    groupName: {
        type: String,
        required: true,
    },
    aboutGroup: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    members: [
        {
            user: {
                type: Types.ObjectId,
                ref: 'User',
            },
            status: {
                type: String, enum: ['pending', 'joined', 'rejected'],
                default: 'pending',
            },
        },
    ],
    likes: [
        {
            type: Types.ObjectId,
            ref: "User",
        },
    ],
    comments: [
        {
            userId: {
                type: Types.ObjectId,
                ref: "User",
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
        },
    ],
    reposts: [
        {
            type: Types.ObjectId,
            ref: "GroupPost",
            required: true,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const GroupPost = mongoose.model<GroupPostInterface>('GroupPost', groupPostSchema);
