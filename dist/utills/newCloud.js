"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToCloudinary = exports.upload = void 0;
const streamifier_1 = __importDefault(require("streamifier"));
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const storage = multer_1.default.memoryStorage();
exports.upload = (0, multer_1.default)({ storage });
cloudinary_1.v2.config({
    cloud_name: 'dwlkyt8w0',
    api_key: process.env.clodinary_cloud_api_key,
    api_secret: process.env.clodinary_cloud_api_key_secret,
});
const uploadToCloudinary = async (file, resourceType) => {
    const fileStream = streamifier_1.default.createReadStream(file.buffer);
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary_1.v2.uploader.upload_stream({ resource_type: resourceType === 'audio' ? 'raw' : resourceType }, (error, result) => {
            if (error) {
                reject(error);
            }
            else {
                const secureUrl = result === null || result === void 0 ? void 0 : result.secure_url;
                if (secureUrl) {
                    resolve(secureUrl);
                }
                else {
                    reject(new Error('Error uploading file to Cloudinary'));
                }
            }
        });
        fileStream.pipe(uploadStream);
    });
};
exports.uploadToCloudinary = uploadToCloudinary;
//# sourceMappingURL=newCloud.js.map