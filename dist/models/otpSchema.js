"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Otp = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const otpData = new mongoose_1.default.Schema({
    userId: {
        type: mongoose_1.default.Schema.Types.ObjectId, ref: 'User',
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
exports.Otp = mongoose_1.default.model('Otp', otpData);
//# sourceMappingURL=otpSchema.js.map