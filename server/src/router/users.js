import { Router } from "express";
import userController from "../controllers/userController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = new Router();

router.get('/', authMiddleware, userController.getAll);
router.get('/getone/:tag', userController.getOne);
router.get('/chats/:id', authMiddleware, userController.getChats);
router.get('/usersInChats/:id', authMiddleware, userController.getUsersInChats);
router.get('/usersNotInChat/:chatId', authMiddleware, userController.getAllNotInChat);
router.get('/auth', authMiddleware, userController.check)
router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.put('/update/:tag', authMiddleware, userController.update);
router.put('/changepassword', authMiddleware, userController.changePassword);
router.delete('/:tag', authMiddleware, userController.delete);

export default router