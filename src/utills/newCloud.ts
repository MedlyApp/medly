import streamifier from 'streamifier';
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
const storage = multer.memoryStorage();
export const upload = multer({ storage });
cloudinary.config({
    cloud_name: 'dwlkyt8w0',
    api_key: process.env.clodinary_cloud_api_key as string,
    api_secret: process.env.clodinary_cloud_api_key_secret as string,
});


type ResourceType = 'audio' | 'auto' | 'image' | 'video' | 'raw' | undefined;
export const uploadToCloudinary = async (file: Express.Multer.File, resourceType: ResourceType): Promise<string> => {
    const fileStream = streamifier.createReadStream(file.buffer);
    return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: resourceType === 'audio' ? 'raw' : resourceType },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    const secureUrl = result?.secure_url;
                    if (secureUrl) {
                        resolve(secureUrl);
                    } else {
                        reject(new Error('Error uploading file to Cloudinary'));
                    }
                }
            }
        );

        fileStream.pipe(uploadStream);
    });
};
