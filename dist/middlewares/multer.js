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
    cloud_name: 'dwlkyt8w0',
    api_key: '432296571787281',
    api_secret: 'koZZQsTDHvfdYuBnIBLfFljabwA'
});
const storageOptions = {
    cloudinary: cloudinary_1.v2,
    params: (req, file, cb) => {
        const post = req.body;
        const userId = post.userId;
        const postId = post._id;
        const ext = (0, path_1.extname)(file.originalname);
        const filename = `${userId}-${postId}-${Date.now()}${ext}`;
        const params = {
            folder: "uploads",
            allowed_formats: ["jpeg", "jpg", "png", "gif", "mp4", "avi", "mov", "pdf", "doc", "docx", "xls", "xlsx"],
            public_id: filename,
        };
        cb(null, params);
    },
};
exports.upload = (0, multer_1.default)({
    storage: new multer_storage_cloudinary_1.CloudinaryStorage(storageOptions),
    limits: { fileSize: 100000000000 },
});
//# sourceMappingURL=multer.js.map