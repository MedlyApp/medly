import multer from "multer";
import { Request } from "express";
import { v2 as cloudinaryV2 } from "cloudinary";
import stream, { ReadableOptions } from "stream";
import { CloudinaryImage } from "../types/fileUpload.types";

const { config: cloudConfig } = cloudinaryV2;
const cloudinary = {
    cloud_name: 'dwlkyt8w0',
    api_key: process.env.clodinary_cloud_api_key as string,
    api_secret: process.env.clodinary_cloud_api_key_secret as string,
};
cloudConfig(cloudinary);
type ReadableStream = Buffer | string | null;
const createReadStream = (
    object: ReadableStream,
    options?: ReadableOptions
) => {
    return new MultiStream(object, options);
};
class MultiStream extends stream.Readable {
    _object: ReadableStream;
    constructor(object: ReadableStream, options?: ReadableOptions) {
        super(options);
        if (object instanceof Buffer || typeof object === "string") {
            options = options || {};
            stream.Readable.call(this, {
                highWaterMark: options.highWaterMark,
                encoding: options.encoding,
            });
        } else {
            stream.Readable.call(this, { objectMode: true });
        }
        this._object = object;
    }
    _read() {
        this.push(this._object);
        this._object = null;
    }
}

const whitelist = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
    "video/mp4",
    "video/avi",
    "video/mov",

];
const fileUpload = multer({
    fileFilter(_req, file, callback) {
        if (whitelist.includes(file.mimetype)) {
            callback(null, true);
        } else {
            callback(null, false);
            return callback(new Error("Your file type is not supported!"));
        }
    },
});
export const singleFileUploadMiddleware = fileUpload;

export const singleFileUpload = async (request: Request) => {
    const streamUpload = (req: Request) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinaryV2.uploader.upload_stream(
                (error: any, result: CloudinaryImage) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
            createReadStream(req.file!.buffer).pipe(stream);
        });
    };

    const { fileTypeFromStream } = await (eval('import("file-type")') as Promise<
        typeof import("file-type")
    >);
    if (!request.file) throw new Error("file not included in request");
    const stream = createReadStream(request.file.buffer);
    const meta = (await fileTypeFromStream(stream))!;
    if (!whitelist.includes(meta.mime))
        throw new Error(`${meta.mime} file is not allowed`);
    return (await streamUpload(request)) as CloudinaryImage;
};


export const multFileUpload = async <T>(files: any) => {
    let streamUpload = (file: Express.Multer.File) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinaryV2.uploader.upload_stream(
                (error: any, result: any) => {
                    if (result) {
                        resolve(result);
                    } else {
                        reject(error);
                    }
                }
            );
            createReadStream(file.buffer).pipe(stream);
        });
    };
    const imageMap: Map<T, CloudinaryImage> = new Map();
    await Promise.all(
        Object.keys(files).map(async (filename) => {
            const _file = files[filename][0];
            imageMap.set(
                filename as unknown as T,
                (await streamUpload(_file)) as CloudinaryImage
            );
            return imageMap;
        })
    );
    return imageMap;
};