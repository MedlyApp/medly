import { Request } from 'express';
import { UserInterface } from '../models/userSchema';
export interface userRequest extends Request {
    user?: UserInterface;

}