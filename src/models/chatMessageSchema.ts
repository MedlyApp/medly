import mongoose, { Document, ObjectId } from 'mongoose';

export interface ChatMessageInterface extends Document {
    senderId: ObjectId;
    receiverId: ObjectId;
    message: string;
    likes: mongoose.Types.ObjectId[];
    comments: {
        userId: mongoose.Types.ObjectId;
        text: string;
    }[];
    createdAt: Date;
}

const chatMessageSchema = new mongoose.Schema<ChatMessageInterface>({
    senderId: {
        type: mongoose.Types.ObjectId, ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Types.ObjectId, ref: "User",
        required: true,
    },
    message: {
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const ChatMessage = mongoose.model<ChatMessageInterface>('ChatMessage', chatMessageSchema);
