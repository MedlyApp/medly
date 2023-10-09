import express, { Response, Request } from 'express';
import { auth } from "../middlewares/userAuth";
const url = require('url');
import { uploadFile } from '../middlewares/cloudinary';
import { googleAuth, oauth2Client } from '../utills/gogleAuth';
import multer from "multer";
import {
    replyPost, createPosts, createImagePost,
    createVideoPost, createAudioPost,
    createFilePost, postLike, unlikePost,
    replyLike, unlikeReply
} from '../controllers/postController';
import { validatePost } from '../middlewares/validation';
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });


const router = express.Router();

router.get('/google/test', googleAuth);



router.post('/create/post', upload.fields([
    { name: 'image', maxCount: 5 },
    { name: 'video', maxCount: 1 },
    { name: 'audio', maxCount: 5 },
    { name: 'files', maxCount: 5 },
]), createPosts);
router.post('/create/post-video', upload.single('video'), auth, createVideoPost);
router.post('/create/post-image', upload.fields([{ name: 'image', maxCount: 5 }]), auth, createImagePost);
router.post('/create/post-audio', upload.fields([{ name: 'audio', maxCount: 5 }]), auth, createAudioPost);
router.post('/create/post-file', upload.fields([{ name: 'file', maxCount: 5 }]), auth, createAudioPost);
router.post('/reply/post/:id', upload.fields([{ name: 'image', maxCount: 5 }]), auth, replyPost);
router.put('/post-like/:postId', auth, postLike);
router.put('/post-unlike/:postId', auth, unlikePost);
router.put('/comment-like/:replyId', auth, replyLike);
router.put('/comment-unlike/:postId', auth, unlikeReply);



export default router;