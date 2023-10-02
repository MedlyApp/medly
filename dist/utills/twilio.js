"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSms = void 0;
const twilio_1 = __importDefault(require("twilio"));
const accountSid = "ACf2bf230b49ccfe76313e49f98bb0c22a";
const authToken = "c5e2a5e164cad26185abffa7e1693edf";
const twilioNumber = "+17165084235";
const client = (0, twilio_1.default)(accountSid, authToken);
function sendSms(phoneNumber, message) {
    client.messages
        .create({
        body: message,
        from: twilioNumber,
        to: '+234' + phoneNumber.slice(1, phoneNumber.length)
    })
        .then((message) => console.log(message.sid))
        .then((error) => console.log(error));
}
exports.sendSms = sendSms;
// const message = 'Hello, this is a test message from Medly.';
// const phoneNumber = '09016999693';
// const result = sendSms(phoneNumber, message);
// console.log`result: ${result}`
//# sourceMappingURL=twilio.js.map