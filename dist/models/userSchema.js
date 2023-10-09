"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
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
exports.User = mongoose_1.default.model('User', userSchema);
//# sourceMappingURL=userSchema.js.map