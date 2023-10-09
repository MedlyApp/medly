"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const gogleAuth_1 = require("../utills/gogleAuth");
const url = require('url');
const router = express_1.default.Router();
router.get('/', (req, res) => {
    res.send('Welcome to medly social app ✍️');
});
router.get('/auth/google/callback', gogleAuth_1.googleAuthCallback);
// router.get('/google/auth/callback', async (req: Request, res: Response) => {
//     try {
//         if (req.url.startsWith('/oauth2callback')) {
//             let q = url.parse(req.url, true).query;
//             const { tokens } = await oauth2Client.getToken(q.code);
//             const googleProfile = await getGoogleProfile(tokens.access_token ?? '');
//             const existingUser = await User.findOne({ googleId: googleProfile.sub });
//             if (existingUser) {
//                 existingUser.googleAccessToken = tokens.access_token ?? undefined;
//                 existingUser.googleRefreshToken = tokens.refresh_token ?? undefined;
//                 await existingUser.save();
//                 console.log('Existing user updated:', existingUser);
//             } else {
//                 const newUser = new User({
//                     googleId: googleProfile.sub,
//                     firstName: googleProfile.given_name,
//                     lastName: googleProfile.family_name,
//                     email: googleProfile.email ?? '',
//                     profilePictureUrl: googleProfile.picture ?? '',
//                     googleAccessToken: tokens.access_token,
//                     googleRefreshToken: tokens.refresh_token,
//                 });
//                 await newUser.save();
//                 console.log('New user created:', newUser);
//             }
//         }
//         res.redirect('/success');
//     } catch (error) {
//         console.error('Error during OAuth2 callback:', error);
//         res.status(500).send('Internal Server Error');
//     }
// });
// async function getGoogleProfile(accessToken: string) {
//     const response = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
//         headers: {
//             'Authorization': `Bearer ${accessToken}`,
//         },
//     });
//     if (!response.ok) {
//         throw new Error('Failed to fetch Google profile');
//     }
//     return await response.json();
// }
router.get('/success', (req, res) => {
    res.send('You have successfully logged in');
});
exports.default = router;
//# sourceMappingURL=indexRoute.js.map