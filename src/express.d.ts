import { Request } from 'express';

declare global {
    namespace Express {
        interface Request {
            user: { id: string };
            // Add any other custom properties related to the 'user' object if needed
        }
    }
}