"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudin = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const storage = multer_1.default.memoryStorage(); // Store files in memory
exports.upload = (0, multer_1.default)({ storage });
dotenv_1.default.config();
// Initialize Cloudinary
exports.cloudin = cloudinary_1.v2.config({
    cloud_name: 'dwlkyt8w0',
    api_key: '432296571787281',
    api_secret: 'koZZQsTDHvfdYuBnIBLfFljabwA'
});
//# sourceMappingURL=cloud.js.map