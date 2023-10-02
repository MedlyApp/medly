import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import mongoose, { ObjectId } from "mongoose";
import dotenv from "dotenv";

dotenv.config();

// Initialize Cloudinary
cloudinary.config({
    cloud_name: 'dwlkyt8w0',
    api_key: '432296571787281',
    api_secret: 'koZZQsTDHvfdYuBnIBLfFljabwA'
});

// export const uploadFile = async (fileUrl: string, publicId: string, fileType: string): Promise<{ success: boolean, message?: string, result?: UploadApiResponse }> => {
//     try {
//         // Determine resource_type based on fileType
//         let resourceType: 'image' | 'video' | 'raw' = 'raw';

//         if (fileType === "image") {
//             resourceType = "image";
//         } else if (fileType === "video") {
//             resourceType = "video";
//         } else if (fileType === "file") {
//             resourceType = "raw";
//         }

//         // Upload the file to Cloudinary
//         const uploadOptions = {
//             public_id: publicId,
//             resource_type: resourceType
//         };

//         const result = await cloudinary.uploader.upload(fileUrl, uploadOptions);

//         // Return success and Cloudinary response
//         return { success: true, result };
//     } catch (err) {
//         // Handle errors gracefully
//         return { success: false, message: err.message };
//     }
// };

export const uploadFile = async (fileUrl: string, publicId: string, fileType: string): Promise<unknown> => {
    try {
        let uploadOptions: any;
        console.log(fileType);
        console.log(fileUrl);
        console.log(publicId);
        console.log("Upload options", uploadOptions)

        if (fileType === "image") {
            uploadOptions = { ...uploadOptions, resource_type: "image" };
        } else if (fileType === "video") {
            uploadOptions = { ...uploadOptions, resource_type: "video" };
        } else if (fileType === "file") {
            uploadOptions = { ...uploadOptions, resource_type: "raw" };
        }

        const result = await cloudinary.uploader.upload(fileUrl, uploadOptions);

        // Check if the upload was successful and return the secure_url
        if (result && result.secure_url) {
            return result.secure_url;
        } else {
            throw new Error('Error uploading the file');
        }
    } catch (err) {
        console.log(err);
    }
};


