"use strict";
// import { Request, Response, NextFunction } from 'express';
// import axios from "axios"
// import jwt from "jsonwebtoken"
// import { getTokens } from '../utills/googleAuth';
// import { User, UserInterface } from '../models/userSchema';
// const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
// const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET
// const port = 8082;
// const JWT_SECRET = process.env.JWT_SECRET as string
// export const googleSignIn = async (req: Request, res: Response) => {
//     try {
//         const code = req.query.code;
//         if (!code) {
//             return res.status(400).json({ error: 'Missing authorization code' });
//         }
//         const { id_token, access_token } = await getTokens({
//             code,
//             clientId: GOOGLE_CLIENT_ID,
//             clientSecret: GOOGLE_CLIENT_SECRET,
//             redirectUri: `http://localhost:${port}/auth/google/callback`,
//         });
//         const googleUser = await axios
//             .get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`, {
//                 headers: {
//                     Authorization: `Bearer ${id_token}`,
//                 },
//             })
//             .then((response) => response.data)
//             .catch((error) => {
//                 console.error('Failed to fetch user:', error);
//                 throw new Error('Failed to fetch user');
//             });
//         const user = await User.findOne({ email: googleUser.email });
//         if (!user) {
//             const newUser: UserInterface = await User.create({
//                 id: googleUser.id,
//                 firstName: googleUser.given_name,
//                 lastName: googleUser.family_name,
//                 email: googleUser.email,
//                 password: "",
//                 gender: "",
//                 profilePhoto: 'https://images.pexels.com/photos/674010/pexels-photo-674010.jpeg?auto=compress&cs=tinysrgb&w=600',
//                 // verify: true
//             });
//             const token = jwt.sign({ _id: newUser._id }, JWT_SECRET, { expiresIn: '30d' });
//             res.cookie('token', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 });
//             return res.status(200).json({ message: 'User registered successfully' });
//         }
//         // If user already exists, you might want to return a different response here.
//     } catch (error) {
//         console.error(error);
//         return res.status(500).json({ error: 'Internal Server Error' });
//     }
// };
//# sourceMappingURL=googleAuth.js.map