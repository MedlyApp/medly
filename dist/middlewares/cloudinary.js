"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadFile = void 0;
const cloudinary_1 = require("cloudinary");
// Configuration
cloudinary_1.v2.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret,
});
console.log(`configuring cloudinary with cloud_name: ${process.env.clodinary_cloud_api_key_secret}`);
const uploadFile = async (fileUrl, publicId, fileType) => {
    try {
        let uploadOptions = { public_id: publicId };
        if (fileType === "image") {
            uploadOptions = { ...uploadOptions, resource_type: "image" };
        }
        else if (fileType === "video") {
            uploadOptions = { ...uploadOptions, resource_type: "video" };
        }
        else if (fileType === "file") {
            uploadOptions = { ...uploadOptions, resource_type: "raw" };
        }
        const result = await cloudinary_1.v2.uploader.upload(fileUrl, uploadOptions);
        return result;
    }
    catch (err) {
        throw err;
    }
};
exports.uploadFile = uploadFile;
//# sourceMappingURL=cloudinary.js.map