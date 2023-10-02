"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = require("../middlewares/userAuth");
const multer_1 = require("../middlewares/multer");
const postController_1 = require("../controllers/postController");
const router = express_1.default.Router();
router.post('/create/post', multer_1.upload.fields([{ name: "image" }, { name: "video" }]), userAuth_1.auth, postController_1.createPosts);
router.post('/reply/post/:id', userAuth_1.auth, postController_1.replyPost);
exports.default = router;
//# sourceMappingURL=postRoute.js.map