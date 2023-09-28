import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import dotenv from "dotenv";

// Configuration
cloudinary.config({
    cloud_name: process.env.cloudinary_cloud_name as string,
    api_key: process.env.cloudinary_api_key as string,
    api_secret: process.env.cloudinary_api_secret as string,
});

console.log(`configuring cloudinary with cloud_name: ${process.env.clodinary_cloud_api_key_secret}`)


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
}