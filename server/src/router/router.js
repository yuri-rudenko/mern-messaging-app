import messageRouter from "./messages.js";
import chatRouter from "./chats.js";
import userRouter from "./users.js";
import fileRouter from "./files.js";
import { Router } from "express";

const router = new Router();

router.use('/message', messageRouter);
router.use('/chat', chatRouter);
router.use('/user', userRouter);
router.use('/files', fileRouter);

export default router