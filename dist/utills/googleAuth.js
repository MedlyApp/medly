"use strict";
// import querystring from 'querystring';
// import axios from 'axios';
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
// const port = 8082; // Make sure this is the correct port.
// const JWT_SECRET = process.env.JWT_SECRET as string;
// export const getGoogleAuthURL = () => {
//     const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
//     const options = {
//         redirect_uri: `http://localhost:${port}/auth/google/callback`,
//         client_id: GOOGLE_CLIENT_ID,
//         access_type: 'offline',
//         response_type: 'code',
//         prompt: 'consent',
//         scope: [
//             'https://www.googleapis.com/auth/userinfo.profile',
//             'https://www.googleapis.com/auth/userinfo.email',
//         ].join(' '),
//     };
//     return `${rootUrl}?${querystring.stringify(options)}`;
// };
// export const getTokens = async ({ code, clientId, clientSecret }: any) => {
//     const url = 'https://oauth2.googleapis.com/token';
//     const values = {
//         code,
//         client_id: clientId,
//         client_secret: clientSecret,
//         redirect_uri: `http://localhost:${port}/auth/google/callback`, // Corrected the redirect_uri
//         grant_type: 'authorization_code',
//     };
//     try {
//         const response = await axios.post(
//             url,
//             querystring.stringify(values),
//             {
//                 headers: {
//                     'Content-Type': 'application/x-www-form-urlencoded',
//                 },
//             }
//         );
//         return response.data;
//     } catch (error) {
//         console.error('Failed to fetch auth tokens:', error);
//         throw error; // Re-throw the error for better handling upstream
//     }
// };
//# sourceMappingURL=googleAuth.js.map