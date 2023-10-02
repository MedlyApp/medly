import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import multer from "multer";
import mongoose, { ObjectId } from "mongoose";
import dotenv from "dotenv";
const storage = multer.memoryStorage(); // Store files in memory
export const upload = multer({ storage });

dotenv.config();

// Initialize Cloudinary
export const cloudin = cloudinary.config({
    cloud_name: 'dwlkyt8w0',
    api_key: '432296571787281',
    api_secret: 'koZZQsTDHvfdYuBnIBLfFljabwA'
});