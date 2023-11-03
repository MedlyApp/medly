import mongoose, { Document, Schema, Model } from "mongoose";
import { PlanInput, } from "../utills/interfaces";


const planSchema = new mongoose.Schema<PlanInput>(
    {
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
    }
);

export const Plans = mongoose.model<PlanInput>('Plans', planSchema);