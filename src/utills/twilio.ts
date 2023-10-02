import twilio from 'twilio';
const accountSid = "ACf2bf230b49ccfe76313e49f98bb0c22a" as string;
const authToken = "c5e2a5e164cad26185abffa7e1693edf" as string;
const twilioNumber = "+17165084235" as string;
const client = twilio(accountSid, authToken);


export function sendSms(phoneNumber: string, message: string) {
    client.messages
        .create({
            body: message,
            from: twilioNumber,
            to: '+234' + phoneNumber.slice(1, phoneNumber.length)
        })
        .then((message: any) => console.log(message.sid))
        .then((error: any) => console.log(error));
}

// const message = 'Hello, this is a test message from Medly.';
// const phoneNumber = '09016999693';

// const result = sendSms(phoneNumber, message);
// console.log`result: ${result}`

