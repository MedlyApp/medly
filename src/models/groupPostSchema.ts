import mongoose, { Document, ObjectId } from 'mongoose';

export interface GroupPostInterface extends Document {
    // groupId: ObjectId;
    userId: ObjectId;
    content: string;
    groupName: string;
    aboutGroup: string;
    likes?: mongoose.Types.ObjectId[];
    comments?: {
        userId: mongoose.Types.ObjectId;
        text: string;
    }[];
    reposts?: mongoose.Types.ObjectId[];
    createdAt: Date;
}

const groupPostSchema = new mongoose.Schema<GroupPostInterface>({
    // groupId: {
    //     type: mongoose.Types.ObjectId, ref: "Group",
    //     required: true,
    // },
    userId: {
        type: mongoose.Types.ObjectId, ref: "User",
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
    likes: {
        type: [mongoose.Types.ObjectId], ref: "User",
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
        type: [mongoose.Types.ObjectId], ref: "GroupPost",
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const GroupPost = mongoose.model<GroupPostInterface>('GroupPost', groupPostSchema);
