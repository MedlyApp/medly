// import querystring from 'querystring';
// import axios from 'axios';


// const GOOGLE_CLIENT_ID = process.env.CLIENT_ID
// const GOOGLE_CLIENT_SECRET = process.env.CLIENT_SECRET
// const GOOGLE_REDIRECT_URL = process.env.REDIRECT_URL

// const JWT_SECRET = process.env.JWT_SECRET_KEY



// export const getGoogleAuthURL = () => {
//     const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
//     const options = {
//         redirect_uri: `http://localhost:${port}/auth/google`,
//         client_id: GOOGLE_CLIENT_ID,
//         access_type: "offline",
//         response_type: "code",
//         prompt: "consent",
//         scope: [
//             "https://www.googleapis.com/auth/userinfo.profile",
//             "https://www.googleapis.com/auth/userinfo.email",
//         ].join(" "),
//     };

//     return `${rootUrl}?${querystring.stringify(options)}`;
// }

// export const getTokens = async ({
//     code,
//     clientId,
//     clientSecret,
// }: any
// ) => {
//     /*
//      * Uses the code to get tokens
//      * that can be used to fetch the user's profile
//      */
//     const url = "https://oauth2.googleapis.com/token";
//     const values = {
//         code,
//         client_id: clientId,
//         client_secret: clientSecret,
//         redirect_uri: `http://localhost:${port}/auth/google`,
//         grant_type: "authorization_code",
//     };

//     try {
//         const res = await axios
//             .post(url, querystring.stringify(values), {
//                 headers: {
//                     "Content-Type": "application/x-www-form-urlencoded",
//                 },
//             });
//         return res.data;
//     } catch (error) {
//         console.error(`Failed to fetch auth tokens`);
//         ;
//     }
// }