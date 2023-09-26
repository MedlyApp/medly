import { v2 as cloudinary, UploadApiResponse } from "cloudinary";

// Configuration
cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name,
    api_key: process.env.cloudinary_api_key,
    api_secret: process.env.cloudinary_api_secret,
});

console.log(`configuring cloudinary with cloud_name: ${process.env.cloudinary_cloud_name}, api_key: ${process.env.cloudinary_api_key}, api_secret: ${process.env.cloudinary_api_secret}`)


export const uploadFile = async (fileUrl: string, publicId: string, fileType: string): Promise<UploadApiResponse> => {
    try {
        let uploadOptions: any = { public_id: publicId };

        if (fileType === "image") {
            uploadOptions = { ...uploadOptions, resource_type: "image" };
        } else if (fileType === "video") {
            uploadOptions = { ...uploadOptions, resource_type: "video" };
        } else if (fileType === "file") {
            uploadOptions = { ...uploadOptions, resource_type: "raw" };
        }

        const result = await cloudinary.uploader.upload(fileUrl, uploadOptions);
        return result;
    } catch (err) {
        throw err;
    }
};