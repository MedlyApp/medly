"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.multFileUpload = exports.singleFileUpload = exports.singleFileUploadMiddleware = void 0;
const multer_1 = __importDefault(require("multer"));
const cloudinary_1 = require("cloudinary");
const stream_1 = __importDefault(require("stream"));
const { config: cloudConfig } = cloudinary_1.v2;
const cloudinary = {
    cloud_name: 'dwlkyt8w0',
    api_key: process.env.clodinary_cloud_api_key,
    api_secret: process.env.clodinary_cloud_api_key_secret,
};
cloudConfig(cloudinary);
const createReadStream = (object, options) => {
    return new MultiStream(object, options);
};
class MultiStream extends stream_1.default.Readable {
    constructor(object, options) {
        super(options);
        if (object instanceof Buffer || typeof object === "string") {
            options = options || {};
            stream_1.default.Readable.call(this, {
                highWaterMark: options.highWaterMark,
                encoding: options.encoding,
            });
        }
        else {
            stream_1.default.Readable.call(this, { objectMode: true });
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
const fileUpload = (0, multer_1.default)({
    fileFilter(_req, file, callback) {
        if (whitelist.includes(file.mimetype)) {
            callback(null, true);
        }
        else {
            callback(null, false);
            return callback(new Error("Your file type is not supported!"));
        }
    },
});
exports.singleFileUploadMiddleware = fileUpload;
const singleFileUpload = async (request) => {
    const streamUpload = (req) => {
        return new Promise((resolve, reject) => {
            const stream = cloudinary_1.v2.uploader.upload_stream((error, result) => {
                if (result) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            });
            createReadStream(req.file.buffer).pipe(stream);
        });
    };
    const { fileTypeFromStream } = await eval('import("file-type")');
    if (!request.file)
        throw new Error("file not included in request");
    const stream = createReadStream(request.file.buffer);
    const meta = (await fileTypeFromStream(stream));
    if (!whitelist.includes(meta.mime))
        throw new Error(`${meta.mime} file is not allowed`);
    return (await streamUpload(request));
};
exports.singleFileUpload = singleFileUpload;
const multFileUpload = async (files) => {
    let streamUpload = (file) => {
        return new Promise((resolve, reject) => {
            let stream = cloudinary_1.v2.uploader.upload_stream((error, result) => {
                if (result) {
                    resolve(result);
                }
                else {
                    reject(error);
                }
            });
            createReadStream(file.buffer).pipe(stream);
        });
    };
    const imageMap = new Map();
    await Promise.all(Object.keys(files).map(async (filename) => {
        const _file = files[filename][0];
        imageMap.set(filename, (await streamUpload(_file)));
        return imageMap;
    }));
    return imageMap;
};
exports.multFileUpload = multFileUpload;
//# sourceMappingURL=cloud.js.map