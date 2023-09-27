import express, { Response, Request } from 'express';
import { auth } from "../middlewares/userAuth";
import { createPosts, replyPost } from '../controllers/postController';
import { validatePost } from '../middlewares/validation';


const router = express.Router();

router.post('/create/post', auth, createPosts);
router.post('/reply/post/:id', auth, replyPost);





export default router;