import { extname as _extname } from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage, Options as CloudinaryStorageOptions } from "multer-storage-cloudinary";
import { Request } from "express";
import { PostInterface, } from '../utills/interfaces';
import { UserInterface } from "../models/userSchema";

cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret,
});

const storageOptions: CloudinaryStorageOptions = {
    cloudinary: cloudinary,
    params: (req: Request, file: Express.Multer.File, cb: (error: Error | null, params: any) => void) => {
        const user: UserInterface = req.body as UserInterface;
        const userId = user._id;
        const profilePicture = user.profilePicture || 'https://res.cloudinary.com/dq7l8216n/image/upload/v1628584753/medly/placeholder-image.jpg';
        const ext = _extname(file.originalname);
        const filename = `${userId}-${profilePicture}-${Date.now()}${ext}`;
        const params = {
            folder: "uploads",
            allowed_formats: ["jpeg", "jpg", "png", "gif", "mp4", "avi", "mov", "pdf", "doc", "docx", "xls", "xlsx"],
            public_id: filename,
        };

        cb(null, params);
    },
};


export const uploadProfile = multer({
    storage: new CloudinaryStorage(storageOptions),
    limits: { fileSize: 100000000000 },
});

