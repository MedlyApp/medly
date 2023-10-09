import mongoose, { Document } from 'mongoose';

export interface SocialLinks {
    facebook: string;
    instagram: string;
    twitter: string;
    linkedin: string;
}

export interface UserInterface extends Document {
    id?: string;
    googleAccessToken?: string;
    googleRefreshToken?: string;
    googleId: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    dateOfBirth?: Date;
    password: string;
    gender: string;
    bio?: string;
    location?: string;
    socialLinks?: SocialLinks;
    profilePicture?: string;
    // userType?: string;
    isVerified?: boolean;
    isLocked?: boolean;
    role?: 'user' | 'admin';
}

const userSchema = new mongoose.Schema<UserInterface>({
    id: { type: String },
    googleId: { type: String },
    googleAccessToken: { type: String },
    googleRefreshToken: { type: String },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    socialLinks: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String,
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true,
    },
    gender: {
        type: String,
        required: true,
        enum: ['male', 'female', 'custom'],
        default: 'custom',
    },
    phoneNumber: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,

    },
    password: {
        type: String,
        required: true,
    },
    profilePicture: {
        type: String,
        required: true,
        default: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    bio: {
        type: String,

    },
    location: {
        type: String,

    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true,
    },
    isLocked: {
        type: Boolean,
        default: false,
        required: true,
    },

    // userType: {
    //     type: String,
    //     required: true,
    //     enum: ['doctor', 'regular', 'admin'],
    //     default: 'regular',
    // },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
}, {
    timestamps: true,
});

export const User = mongoose.model<UserInterface>('User', userSchema);
