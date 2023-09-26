"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatMessage = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const chatMessageSchema = new mongoose_1.default.Schema({
    senderId: {
        type: mongoose_1.default.Types.ObjectId, ref: "User",
        required: true,
    },
    receiverId: {
        type: mongoose_1.default.Types.ObjectId, ref: "User",
        required: true,
    },
    message: {
        type: String,
        required: true,
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
exports.ChatMessage = mongoose_1.default.model('ChatMessage', chatMessageSchema);
//# sourceMappingURL=chatMessageSchema.js.map