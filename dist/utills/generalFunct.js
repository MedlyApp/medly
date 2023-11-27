"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreatePlans = void 0;
const secret = "FLWSECK_TEST-deb661e185e26c8e7e21ec97013e6a05-X";
const pub = "FLWPUBK_TEST-661f207a8c29b8711c34bbfa944b5497-X";
const planSchema_1 = require("../models/planSchema");
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(`${pub}`, `${secret}`);
const CreatePlans = async (userId) => {
    try {
        const payloadYearly = {
            name: "Yearly Plan",
            interval: "yearly",
            currency: "NGN",
        };
        const payloadMonthly = {
            name: "Monthly Plan",
            interval: "monthly",
            currency: "NGN",
        };
        const [responseMonthly, responseYearly] = await Promise.all([
            flw.PaymentPlan.create(payloadMonthly),
            flw.PaymentPlan.create(payloadYearly)
        ]);
        const monthlyPlan = responseMonthly.data;
        const yearlyPlan = responseYearly.data;
        const plans = [
            {
                organizationId: userId.toString(),
                id: monthlyPlan.id,
                name: "Monthly Plan",
                amount: monthlyPlan.amount,
                interval: "monthly",
                status: monthlyPlan.status,
                duration: monthlyPlan.duration,
                plan_token: monthlyPlan.plan_token,
                currency: monthlyPlan.currency,
                planDescription: "Monthly Payment",
                displayAmount: 3000
            },
            {
                organizationId: userId.toString(),
                id: yearlyPlan.id,
                name: "Yearly Plan",
                amount: yearlyPlan.amount,
                interval: "yearly",
                status: yearlyPlan.status,
                duration: yearlyPlan.duration,
                plan_token: yearlyPlan.plan_token,
                currency: yearlyPlan.currency,
                planDescription: "Yearly Payment",
                displayAmount: 3000
            }
        ];
        if (plans.length > 0) {
            console.log("Inside lifetime");
            const createdPlans = await Promise.all(plans.map(plan => planSchema_1.Plan.create(plan)));
            console.log("Plans inserted successfully", createdPlans);
        }
    }
    catch (error) {
        console.log(error.message);
    }
};
exports.CreatePlans = CreatePlans;
//# sourceMappingURL=generalFunct.js.map