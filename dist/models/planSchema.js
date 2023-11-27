"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Plan = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const planSchema = new mongoose_1.default.Schema({
    organizationId: { type: String, required: true, },
    id: { type: Number, required: true },
    displayAmount: { type: Number, required: true },
    planDescription: { type: String, required: true },
    name: { type: String, required: true },
    amount: { type: Number },
    interval: { type: String, required: true },
    duration: { type: Number, required: true },
    status: { type: String, required: true },
    currency: { type: String, required: true, default: "NGN" },
    plan_token: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
});
exports.Plan = mongoose_1.default.model('Plan', planSchema);
//# sourceMappingURL=planSchema.js.map