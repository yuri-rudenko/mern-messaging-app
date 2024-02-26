import { Router } from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router();

router.get('/:tag');
router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.put('/update/:tag', authMiddleware, userController.update);
router.put('/changepassword', authMiddleware, userController.changePassword);
router.delete('/:tag', authMiddleware, userController.delete);

export default router