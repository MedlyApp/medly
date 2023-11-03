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
    coverPicture: string;
    // userType?: string;
    isVerified?: boolean;
    isLocked?: boolean;
    role?: 'user' | 'admin';
    followers: string[];
    following: string[];
}

const userSchema = new mongoose.Schema<UserInterface>({
    id: { type: String },
    googleId: { type: String },
    googleAccessToken: { type: String },
    googleRefreshToken: { type: String },
    firstName: {
        type: String,

    },
    lastName: {
        type: String,
    },
    socialLinks: {
        facebook: String,
        instagram: String,
        twitter: String,
        linkedin: String,
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'custom'],
        default: 'custom',
    },
    phoneNumber: {
        type: String,

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
        default: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600',
    },
    coverPicture: {
        type: String,
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
    followers: [{
        type: mongoose.Types.ObjectId, ref: "User",
        required: true,
    }],
    following: [{
        type: mongoose.Types.ObjectId, ref: "User",
        required: true,
    }],

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
},
    {
        toJSON: {
            transform(doc, ret) {

                delete ret.password;
                delete ret.role;
                delete ret.isVerified;
                delete ret.__v;
                delete ret.updatedAt;
                delete ret.createdAt;
            },
        },
        timestamps: true,
    });

export const User = mongoose.model<UserInterface>('User', userSchema);
