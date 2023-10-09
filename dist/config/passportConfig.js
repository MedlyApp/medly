"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleStrategy = void 0;
const helperMethods_1 = require("../utills/helperMethods");
const passport_google_oauth20_1 = __importDefault(require("passport-google-oauth20"));
const userSchema_1 = require("../models/userSchema");
const googleAuth = passport_google_oauth20_1.default.Strategy;
const GoogleStrategy = (passport) => {
    passport.use(new googleAuth({
        clientID: process.env.GOOGLE_CLIENT_ID || '',
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
        callbackURL: 'http://localhost:8082/auth/google/callback',
    }, async (accessToken, refreshToken, profile, cb) => {
        try {
            const { sub: googleID, given_name: firstName, family_name: lastName, email, picture: avatar, email_verified: isVerified } = profile._json;
            let newUser;
            const user = await userSchema_1.User.findOne({ googleID: profile.id });
            let token;
            if (user) {
                console.log("am buyer  in database");
                const token = (0, helperMethods_1.generateLoginToken)(user._id);
                console.log("token", token);
                const data = { success: true, message: "User login successfully", token };
                return cb(null, data);
            }
            else if (!user) {
                // User doesn't exist, create a new user account
                newUser = await userSchema_1.User.create({
                    googleID, firstName, lastName, email, isVerified
                });
            }
            const output = { message: "User account created successfully", token };
            return cb(null, output);
        }
        catch (error) {
            console.error(error);
            return cb(error);
        }
    }));
    passport.serializeUser(async (data, cb) => {
        return cb(null, data);
    });
    passport.deserializeUser(async (data, cb) => {
        return cb(null, data);
    });
};
exports.GoogleStrategy = GoogleStrategy;
// passport.use(
//     new GoogleStrategy(
//         {
//             clientID: process.env.GOOGLE_CLIENT_ID || '',
//             clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
//             callbackURL: 'http://localhost:8080/auth/google/callback', // Adjust the URL
//         },
//         async (_accessToken: string, _refreshToken: string, profile, done) => {
//             try {
//                 // Find or create a user based on the Google profile
//                 const user = await User.findOne({ googleId: profile.id });
//                 if (user) {
//                     // User already exists, return it
//                     return done(null, user);
//                 }
//                 // Create a new user if not found
//                 const newUser: UserInterface = new User({
//                     googleId: profile.id,
//                     firstName: (profile.name?.givenName) || '',
//                     lastName: (profile.name?.familyName) || '',
//                     email: (profile.emails?.[0]?.value) || '',
//                     // Add other user properties here as needed
//                 });
//                 await newUser.save();
//                 return done(null, newUser);
//             } catch (error) {
//                 return done(error, undefined);
//             }
//         }
//     )
// );
// passport.serializeUser<UserInterface, any>((user, done) => {
//     done(null, user.id);
// });
// passport.deserializeUser<UserInterface, any>((id, done) => {
//     User.findById(id, (err, user) => {
//         done(err, user);
//     });
// });
//# sourceMappingURL=passportConfig.js.map