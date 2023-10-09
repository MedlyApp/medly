"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupPost = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const groupPostSchema = new mongoose_1.Schema({
    userId: {
        type: mongoose_1.Types.ObjectId,
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
                type: mongoose_1.Types.ObjectId,
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
            type: mongoose_1.Types.ObjectId,
            ref: "User",
        },
    ],
    comments: [
        {
            userId: {
                type: mongoose_1.Types.ObjectId,
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
            type: mongoose_1.Types.ObjectId,
            ref: "GroupPost",
            required: true,
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.GroupPost = mongoose_1.default.model('GroupPost', groupPostSchema);
//# sourceMappingURL=groupPostSchema.js.map