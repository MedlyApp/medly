"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userAuth_1 = require("../middlewares/userAuth");
const multer_1 = __importDefault(require("multer"));
const postController_1 = require("../controllers/postController");
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = express_1.default.Router();
router.post('/create/post', upload.fields([
    { name: 'image', maxCount: 5 },
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 5 },
    { name: 'files', maxCount: 5 },
]), postController_1.createPosts);
router.post('/create/post-video', upload.single('video'), postController_1.createVideoPost);
router.post('/create/post-image', upload.fields([{ name: 'image', maxCount: 5 }]), postController_1.createImagePost);
router.post('/create/post-audio', upload.fields([{ name: 'audio', maxCount: 5 }]), postController_1.createAudioPost);
router.post('/create/post-file', upload.fields([{ name: 'file', maxCount: 5 }]), postController_1.createAudioPost);
router.post('/reply/post/:id', upload.fields([{ name: 'image', maxCount: 5 }]), userAuth_1.auth, postController_1.replyPost);
router.put('/post-like/:postId', userAuth_1.auth, postController_1.postLike);
router.put('/post-unlike/:postId', userAuth_1.auth, postController_1.unlikePost);
router.put('/comment-like/:replyId', userAuth_1.auth, postController_1.replyLike);
router.put('/comment-unlike/:postId', userAuth_1.auth, postController_1.unlikeReply);
exports.default = router;
//# sourceMappingURL=postRoute.js.map