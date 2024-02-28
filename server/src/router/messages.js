import { Router } from "express";
import messageController from "../controllers/messageController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router();

router.get('/:messageId');
router.post('/', authMiddleware, messageController.create);
router.patch('/:messageId');
router.delete('/:messageId');

export default router