"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const userSchema_1 = require("../models/userSchema");
const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret) {
    throw new Error('JWT secret key is not defined');
}
async function auth(req, res, next) {
    try {
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return res.status(401).json({ Error: 'Kindly login as a user' });
        }
        const token = authorizationHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ Error: 'Kindly login as a user' });
        }
        let verified = null;
        try {
            verified = jsonwebtoken_1.default.verify(token, jwtSecret);
        }
        catch (error) {
            return res.status(401).json({ Error: "Token not valid" });
        }
        if (!verified) {
            return res.status(401).json({ Error: "Invalid token, you are not authorized to access this route" });
        }
        const { id } = verified;
        // Find user by id
        const user = await userSchema_1.User.findOne({ _id: id });
        if (!user) {
            return res.status(401).json({ Error: "Kindly login correct details as a user" });
        }
        req.user = verified;
        next();
    }
    catch (error) {
        res.status(401).json({ Error: "User not authenticated, please login first." });
    }
}
exports.auth = auth;
//# sourceMappingURL=userAuth.js.map