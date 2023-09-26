"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GroupPost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const groupPostSchema = new mongoose_1.default.Schema({
    groupId: {
        type: mongoose_1.default.Types.ObjectId, ref: "Group",
        required: true,
    },
    userId: {
        type: mongoose_1.default.Types.ObjectId, ref: "User",
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
        type: [mongoose_1.default.Types.ObjectId], ref: "User",
        default: [],
    },
    comments: [
        {
            userId: {
                type: mongoose_1.default.Types.ObjectId, ref: "User",
                required: true,
            },
            text: {
                type: String,
                required: true,
            },
        },
    ],
    reposts: {
        type: [mongoose_1.default.Types.ObjectId], ref: "GroupPost",
        default: [],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.GroupPost = mongoose_1.default.model('GroupPost', groupPostSchema);
//# sourceMappingURL=groupPostSchema.js.map