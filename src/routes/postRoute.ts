import express, { Response, Request } from 'express';
import { auth } from "../middlewares/userAuth";
import { uploadFile } from '../middlewares/cloudinary';
import { upload } from '../middlewares/multer';
import { replyPost, createPosts } from '../controllers/postController';
// import { replyPost } from '../controllers/postController';
import { validatePost } from '../middlewares/validation';


const router = express.Router();

router.post('/create/post', upload.fields([{ name: "image" }, { name: "video" }]), auth, createPosts);
router.post('/reply/post/:id', auth, replyPost);





export default router;