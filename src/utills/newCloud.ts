import streamifier from 'streamifier';
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { Request } from 'express';
const storage = multer.memoryStorage();
export const upload = multer({ storage });
cloudinary.config({
    cloud_name: 'dwlkyt8w0',
    api_key: process.env.clodinary_cloud_api_key as string,
    api_secret: process.env.clodinary_cloud_api_key_secret as string,
});


type ResourceType = 'raw' | 'auto' | 'image' | 'video' | undefined;
export const uploadToCloudinary = async (file: Express.Multer.File, resourceType: ResourceType): Promise<string> => {
    const fileStream = streamifier.createReadStream(file.buffer);
    return new Promise<string>((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            { resource_type: resourceType },
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


export const handleFileUpload = async (req: Request, user: any) => {
    const files = req.files as Express.Multer.File[];

    const uploadedUrls = await Promise.all(
        files.map(async (file) => {
            const resourceType = file.fieldname === 'image' ? 'auto' : 'video';
            return uploadToCloudinary(file, resourceType);
        })
    );

    return uploadedUrls.filter((url) => url !== '');
};