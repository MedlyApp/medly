"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const path_1 = require("path");
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
cloudinary_1.v2.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret,
});
// Set The Storage Engine
const storageOptions = {
    cloudinary: cloudinary_1.v2,
    params: (req, file, cb) => {
        const post = req.body; // Get the post data from the request body
        const userId = post.userId; // Assuming userId is available in the post data
        const postId = post._id; // Assuming postId is available in the post data
        const ext = (0, path_1.extname)(file.originalname); // Get the file extension
        // Generate a unique filename based on the userId, postId, and current timestamp
        const filename = `${userId}-${postId}-${Date.now()}${ext}`;
        // Set the Cloudinary upload parameters
        const params = {
            folder: "uploads",
            allowed_formats: ["jpeg", "jpg", "png", "gif", "mp4", "avi", "mov", "pdf", "doc", "docx", "xls", "xlsx"],
            public_id: filename, // Use the filename as the public_id
        };
        cb(null, params);
    },
};
// Init Upload
const upload = (0, multer_1.default)({
    storage: new multer_storage_cloudinary_1.CloudinaryStorage(storageOptions),
    limits: { fileSize: 100000000000 },
});
exports.upload = upload;
//# sourceMappingURL=multer.js.map