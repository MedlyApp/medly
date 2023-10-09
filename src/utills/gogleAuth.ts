// import { google } from 'googleapis';
// // const { google } = require('googleapis');
// import express, { Request, Response } from 'express';


// export const oauth2Client = new google.auth.OAuth2(
//     "103895172390-7q1a163c56rrtkk8o6jk7pifgq1krpld.apps.googleusercontent.com",
//     "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",
//     "http://localhost:8082/google/auth/callback",
// );

// function getGoogleAuthUrl() {
//     const scopes = [
//         // 'https://www.googleapis.com/auth/drive.metadata.readonly',
//         'https://www.googleapis.com/auth/userinfo.profile',
//         'https://www.googleapis.com/auth/userinfo.email',
//     ];
//     const authorizationUrl = oauth2Client.generateAuthUrl({
//         access_type: 'offline',
//         scope: scopes,
//         include_granted_scopes: true
//     });

//     return authorizationUrl;
// }

// export const googleAuth = (req: Request, res: Response) => {
//     try {
//         const url = getGoogleAuthUrl();
//         res.redirect(url);
//     } catch (error) {
//         console.error('Error during redirection:', error);
//         res.status(500).send('Internal Server Error');
//     }
// }

// import { google } from 'googleapis';
import { User, UserInterface } from "../models/userSchema";
const { google } = require('googleapis');
import { Request, Response } from 'express';
const OAuth2 = google.auth.OAuth2;


export const oauth2Client = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    redirectUri: process.env.GOOGLE_REDIRECT,
});


// async function getUserProfile(accessToken: string) {
//     const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client });
//     const userInfo = await oauth2.userinfo.get({ auth: oauth2Client });
//     console.log("User info", userInfo.data)
//     return userInfo.data;
// }
async function getUserProfile(accessToken: string) {
    try {
        oauth2Client.setCredentials({ access_token: accessToken });
        const oauth2 = google.oauth2({
            auth: oauth2Client,
            version: 'v2',
        });
        const res = await oauth2.userinfo.get();
        return res.data;
    } catch (err) {
        console.error('Error fetching user profile:', err);
        throw err;
    }
}

export const googleAuth = (req: Request, res: Response) => {
    try {
        const scopes = [
            'https://www.googleapis.com/auth/userinfo.profile',
            'https://www.googleapis.com/auth/userinfo.email',
        ];
        const authorizationUrl = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
            include_granted_scopes: true,
            prompt: "consent",
        });

        res.redirect(authorizationUrl);
    } catch (error) {
        console.error('Error during redirection:', error);
        res.status(500).send('Internal Server Error');
    }
};

export const googleAuthCallback = async (req: Request, res: Response) => {
    try {
        let code = req.query.code;
        const { tokens } = await oauth2Client.getToken(code);

        if (tokens && tokens.access_token) {
            const userProfile = await getUserProfile(tokens.access_token);
            console.log("User profile", userProfile);
            const existingUser = await User.findOne({ googleId: userProfile.id });
            if (!existingUser) {
                const newUser = await User.create({
                    googleId: userProfile.id,
                    firstName: userProfile.given_name,
                    lastName: userProfile.family_name,
                    email: userProfile.email,
                    profilePictureUrl: userProfile.picture,
                    googleAccessToken: tokens.access_token,
                    googleRefreshToken: tokens.refresh_token,
                });
                await newUser.save();
                console.log('New user created:', newUser);
            }
            if (existingUser) {
                existingUser.googleAccessToken = tokens.access_token;
                existingUser.googleRefreshToken = tokens.refresh_token;
                await existingUser.save();
                console.log('Existing user updated:', existingUser);
            }

        } else {
            console.error('No tokens received from Google.');
        }

        res.redirect('/success');
    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
};
