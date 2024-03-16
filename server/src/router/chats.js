import { Router } from "express";
import chatAdminMiddleware from "../middleware/chatAdminMiddleware.js";
import chatController from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router();


router.get('/', chatController.getAll);
router.get('/:chatId', chatController.getOne);
router.post('/', authMiddleware, chatController.create);
router.put('/name', chatAdminMiddleware, chatController.changeName);
router.put('/users/add', chatAdminMiddleware, chatController.addUsers);
router.put('/users/remove', chatAdminMiddleware, chatController.removeUser);
router.put('/leave', authMiddleware, chatController.leaveChat);
router.delete('/:chatId', chatAdminMiddleware, chatController.delete);

export default router