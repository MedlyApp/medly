import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { User, UserInterface } from '../models/userSchema';

const jwtSecret = process.env.JWT_SECRET as Secret;

if (!jwtSecret) {
    throw new Error('JWT secret key is not defined');
}

export async function auth(req: Request | any, res: Response, next: NextFunction): Promise<unknown> {
    try {
        const authorizationHeader = req.headers.authorization;

        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return res.status(401).json({ Error: 'Kindly login as a user' });
        }

        const token = authorizationHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({ Error: 'Kindly login as a user' });
        }

        let verified: { id: string } | null = null;
        try {
            verified = jwt.verify(token, jwtSecret) as { id: string } | null;
        } catch (error) {
            return res.status(401).json({ Error: "Token not valid" });
        }

        if (!verified) {
            return res.status(401).json({ Error: "Invalid token, you are not authorized to access this route" });
        }

        const { id } = verified;

        // Find user by id
        const user = await User.findOne({ _id: id });

        if (!user) {
            return res.status(401).json({ Error: "Kindly login correct details as a user" });
        }

        req.user = verified;
        next();
    } catch (error) {
        res.status(401).json({ Error: "User not authenticated, please login first." });
    }
}