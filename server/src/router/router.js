import messageRouter from "./messages.js";
import chatRouter from "./chats.js";
import userRouter from "./users.js";
import { Router } from "express";
import deleteImage from "../controllers/deleteImage.js";

const router = new Router();

router.use('/message', messageRouter);
router.use('/chat', chatRouter);
router.use('/user', userRouter);
router.delete('/deleteImage', deleteImage)

export default router