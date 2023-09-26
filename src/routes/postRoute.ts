import express, { Response, Request } from 'express';
import { auth } from "../middlewares/userAuth";
// import { } from '../controllers/postController';
import { validatePost } from '../middlewares/validation';


const router = express.Router();





export default router;