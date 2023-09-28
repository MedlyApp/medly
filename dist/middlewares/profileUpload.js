"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadProfile = void 0;
const path_1 = require("path");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret,
});
const storageOptions = {
    cloudinary: cloudinary_1.v2,
    params: (req, file, cb) => {
        const user = req.body;
        const userId = user._id;
        const profilePicture = user.profilePicture || 'https://res.cloudinary.com/dq7l8216n/image/upload/v1628584753/medly/placeholder-image.jpg';
        const ext = (0, path_1.extname)(file.originalname);
        const filename = `${userId}-${profilePicture}-${Date.now()}${ext}`;
        const params = {
            folder: "uploads",
            allowed_formats: ["jpeg", "jpg", "png", "gif", "mp4", "avi", "mov", "pdf", "doc", "docx", "xls", "xlsx"],
            public_id: filename,
        };
        cb(null, params);
    },
};
exports.uploadProfile = (0, multer_1.default)({
    storage: new multer_storage_cloudinary_1.CloudinaryStorage(storageOptions),
    limits: { fileSize: 100000000000 },
});
//# sourceMappingURL=profileUpload.js.map