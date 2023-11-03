"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const secret = "FLWSECK_TEST-deb661e185e26c8e7e21ec97013e6a05-X";
const pub = "FLWPUBK_TEST-661f207a8c29b8711c34bbfa944b5497-X";
const Flutterwave = require('flutterwave-node-v3');
const flw = new Flutterwave(`${pub}`, `${secret}`);
// export const CreatePlans = async (newUser: string) => {
//     try {
// const payloadMonthly = {
//     name: "Monthly Plan",
//     interval: "monthly".toLowerCase(),
//     currency: "NGN",
// };
// const payloadYearly = {
//     name: "Yearly Plan",
//     interval: "yearly".toLowerCase(),
//     currency: "NGN",
// };
// const [responseMonthly, responseYearly] = await Promise.all([
//     flw.PaymentPlan.create(payloadMonthly),
//     flw.PaymentPlan.create(payloadYearly)
// ]);
// const monthlyPlan = responseMonthly.data;
// const yearlyPlan = responseYearly.data;
// console.log({ Monthly: monthlyPlan, Yearly: yearlyPlan });
// const plans = [
//     {
//         organizationId: newUser,
//         id: monthlyPlan.id,
//         name: "Monthly Plan",
//         amount: monthlyPlan.amount,
//         interval: "monthly",
//         status: monthlyPlan.status,
//         duration: monthlyPlan.duration,
//         plan_token: monthlyPlan.plan_token,
//         currency: monthlyPlan.currency,
//         planDescription: "Monthly Payment",
//         displayAmount: 3000
//     },
//     {
//         organizationId: newUser,
//         id: yearlyPlan.id,
//         name: "Yearly Plan",
//         amount: yearlyPlan.amount,
//         interval: "yearly",
//         status: yearlyPlan.status,
//         duration: yearlyPlan.duration,
//         plan_token: yearlyPlan.plan_token,
//         currency: yearlyPlan.currency,
//         planDescription: "Yearly Payment",
//         displayAmount: 3000
//     }
// ];
// console.log("Plans", plans);
// if (plans.length > 0) {
//     console.log("Inside lifetime");
//     const createdPlans = await Promise.all(plans.map(plan => Plans.create(plan)));
//     console.log("Plans inserted successfully", createdPlans);
// }
//     } catch (error: any) {
//         throw new Error(error.message);
//     }
// }
async function insertPlans(userId) {
    try {
        const payloadMonthly = {
            name: "Monthly Plan",
            interval: "monthly",
            currency: "NGN",
        };
        const payloadYearly = {
            name: "Yearly Plan",
            interval: "yearly",
            currency: "NGN",
        };
        flw.PaymentPlan.create(payloadYearly)
            .then((result) => {
            console.log('Success:', result); // Handle the successful result here
        })
            .catch((error) => {
            console.error('Error:', error); // Handle errors here
        });
        // const [responseMonthly, responseYearly] = await Promise.all([
        //     flw.PaymentPlan.create(payloadMonthly),
        //     flw.PaymentPlan.create(payloadYearly)
        // ]);
        // console.log("Monthly response", responseMonthly)
        // console.log("Yearlyly response", responseYearly)
        // const monthlyPlan = responseMonthly.data;
        // const yearlyPlan = responseYearly.data;
        // console.log({ Monthly: monthlyPlan, Yearly: yearlyPlan });
        // const plans = [
        //     {
        //         organizationId: userId,
        //         id: monthlyPlan.id,
        //         name: "Monthly Plan",
        //         amount: monthlyPlan.amount,
        //         interval: "monthly",
        //         status: monthlyPlan.status,
        //         duration: monthlyPlan.duration,
        //         plan_token: monthlyPlan.plan_token,
        //         currency: monthlyPlan.currency,
        //         planDescription: "Monthly Payment",
        //         displayAmount: 3000
        //     },
        //     {
        //         organizationId: userId,
        //         id: yearlyPlan.id,
        //         name: "Yearly Plan",
        //         amount: yearlyPlan.amount,
        //         interval: "yearly",
        //         status: yearlyPlan.status,
        //         duration: yearlyPlan.duration,
        //         plan_token: yearlyPlan.plan_token,
        //         currency: yearlyPlan.currency,
        //         planDescription: "Yearly Payment",
        //         displayAmount: 3000
        //     }
        // ];
        // // Insert the plans into the database
        // await Plans.insertMany(plans);
        // console.log('Plans inserted successfully');
    }
    catch (error) {
        console.error('Error inserting plans:', error);
    }
}
const userId = '123456789';
insertPlans(userId);
// async function someAsyncFunction() {
//     try {
//         await insertPlans(userId);
//     } catch (error) {
//         console.error('Error in someAsyncFunction:', error);
//     }
// }
// someAsyncFunction();
//# sourceMappingURL=generalFunct.js.map