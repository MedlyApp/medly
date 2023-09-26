import mongoose, { Document, ObjectId } from 'mongoose';
import { User } from './userSchema';


export interface otpInterface extends Document {
    userId: ObjectId;
    otp: number;
    otp_expiry: Date;
}

const otpData = new mongoose.Schema<otpInterface>({
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true,
    },
    otp: {
        type: Number,
        required: true,
    },
    otp_expiry: {
        type: Date,
        required: true,
    },
}, { timestamps: true });


export const Otp = mongoose.model<otpInterface>('Otp', otpData);


