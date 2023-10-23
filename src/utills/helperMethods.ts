import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { Response } from 'express';
import httpStatus from 'http-status';

type UserToken = {
    _id: mongoose.Types.ObjectId;
    email: string;
}
type Admin = {
    _id: mongoose.Types.ObjectId;
    email: string;

};

export const generateLoginToken = ({ _id, email }: UserToken): string => {
    const pass = process.env.JWT_SECRET as string;
    const user = { _id, email }
    return jwt.sign(user, pass, { expiresIn: '5d' });
    // return jwt.sign(user, pass, { expiresIn: '1d' });
};
export const generateAdminLoginToken = ({ _id, email }: Admin): string => {
    const pass = process.env.ADMIN_SECRET_KEY as string;
    const user = { _id, email }
    return jwt.sign(user, pass, { expiresIn: '1d' });
    // return jwt.sign(user, pass, { expiresIn: '1d' });
};


export const serverError = (res: Response) => {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Something went wrong, try again later',
    });
};

export const successResponse = (res: Response, message: string, code: number, data: unknown) => {
    return res.status(code).json({
        success: true,
        message,
        data,
    });
};

export const errorResponse = (res: Response, message: string, code: number) => {
    return res.status(code).json({
        success: false,
        message,
    });
};
// export const errorResponse = (res: Response, message: string, status: number): void => {
//     res.status(status).json({ message });
//     return;
// };

export const successResponseLogin = (res: Response, message: string, code: number, data: unknown, token: unknown) => {
    return res.status(code).json({
        success: true,
        message,
        token,
        data,
    });
};


