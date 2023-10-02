"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.successResponseLogin = exports.errorResponse = exports.successResponse = exports.serverError = exports.generateAdminLoginToken = exports.generateLoginToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_status_1 = __importDefault(require("http-status"));
const generateLoginToken = ({ _id, email }) => {
    const pass = process.env.JWT_SECRET;
    const user = { _id, email };
    return jsonwebtoken_1.default.sign(user, pass, { expiresIn: '5d' });
    // return jwt.sign(user, pass, { expiresIn: '1d' });
};
exports.generateLoginToken = generateLoginToken;
const generateAdminLoginToken = ({ _id, email }) => {
    const pass = process.env.ADMIN_SECRET_KEY;
    const user = { _id, email };
    return jsonwebtoken_1.default.sign(user, pass, { expiresIn: '2h' });
    // return jwt.sign(user, pass, { expiresIn: '1d' });
};
exports.generateAdminLoginToken = generateAdminLoginToken;
const serverError = (res) => {
    return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Something went wrong, try again later',
    });
};
exports.serverError = serverError;
const successResponse = (res, message, code, data) => {
    return res.status(code).json({
        success: true,
        message,
        data,
    });
};
exports.successResponse = successResponse;
const errorResponse = (res, message, code) => {
    return res.status(code).json({
        success: false,
        message,
    });
};
exports.errorResponse = errorResponse;
// export const errorResponse = (res: Response, message: string, status: number): void => {
//     res.status(status).json({ message });
//     return;
// };
const successResponseLogin = (res, message, code, data, token) => {
    return res.status(code).json({
        success: true,
        message,
        token,
        data,
    });
};
exports.successResponseLogin = successResponseLogin;
//# sourceMappingURL=helperMethods.js.map