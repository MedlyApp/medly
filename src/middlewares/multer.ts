import { extname as _extname } from "path";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage, Options as CloudinaryStorageOptions } from "multer-storage-cloudinary";
import { Request } from "express";
import { PostInterface } from '../utills/interfaces'; // Import the PostAttributes interface from your model

cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret,
});

const storageOptions: CloudinaryStorageOptions = {
    cloudinary: cloudinary,
    params: (req: Request, file: Express.Multer.File, cb: (error: Error | null, params: any) => void) => {
        const post: PostInterface = req.body as PostInterface;
        const userId = post.userId;
        const postId = post._id;
        const ext = _extname(file.originalname);
        const filename = `${userId}-${postId}-${Date.now()}${ext}`;
        const params = {
            folder: "uploads",
            allowed_formats: ["jpeg", "jpg", "png", "gif", "mp4", "avi", "mov", "pdf", "doc", "docx", "xls", "xlsx"],
            public_id: filename,
        };

        cb(null, params);
    },
};


export const upload = multer({
    storage: new CloudinaryStorage(storageOptions),
    limits: { fileSize: 100000000000 },
});

