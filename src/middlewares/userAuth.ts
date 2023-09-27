import { Request, Response, NextFunction } from 'express';
import httpStatus from 'http-status';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { User, UserInterface } from '../models/userSchema';
import { errorResponse, serverError, successResponse, successResponseLogin } from '../utills/helperMethods';

interface jwtPayload {
    email: string;
    _id: mongoose.Types.ObjectId;
}
const secret = process.env.JWT_SECRET as string;

if (!secret) {
    throw new Error('JWT secret key is not defined');
}



export async function auth(req: Request | any, res: Response, next: NextFunction) {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(httpStatus.UNAUTHORIZED).json({ Error: 'User not verified, you cannot access this route' });
            return;
        }

        let verified = jwt.verify(token, secret);

        if (!verified) {
            return res.status(httpStatus.UNAUTHORIZED).json({ Error: 'User not verified, you cannot access this route' });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(httpStatus.FORBIDDEN).json({ Error: 'User is not not logged in' });
    }
}