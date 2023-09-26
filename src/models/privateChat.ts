import mongoose, { Document, ObjectId } from 'mongoose';

export interface ChatMessageInterface extends Document {
    senderId: ObjectId;
    receiverId: ObjectId;
    message: string;
    createdAt: Date;
}

const chatMessageSchema = new mongoose.Schema<ChatMessageInterface>({
    senderId: {
        type: mongoose.Types.ObjectId, ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const PrivateMessage = mongoose.model<ChatMessageInterface>('PrivateMessage', chatMessageSchema);
