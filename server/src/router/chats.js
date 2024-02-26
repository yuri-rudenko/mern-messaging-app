import { Router } from "express";
import chatAdminMiddleware from "../middleware/chatAdminMiddleware.js";
import chatController from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router();

router.get('/');
router.get('/:chatId');
router.post('/', authMiddleware, chatController.create);
router.put('/users/add/:chatId', chatAdminMiddleware, chatController.addUser);
router.put('/users/remove/:chatId', chatAdminMiddleware);
router.delete('/:chatId');

export default router