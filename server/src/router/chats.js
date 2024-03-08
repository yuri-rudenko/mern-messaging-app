import { Router } from "express";
import chatAdminMiddleware from "../middleware/chatAdminMiddleware.js";
import chatController from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import storage from "../storage.js";

const router = new Router();

const chatPfp = multer({storage: storage('chatPfp')})

router.get('/', chatController.getAll);
router.get('/:chatId', chatController.getOne);
router.post('/', authMiddleware, chatController.create);
router.post('/uploadPfp',chatPfp.single('file'), (req, res) => res.status(200).json({img: req.newFileName})); // not update or change, used on creation
// router.post('/uploadPfp', (req, res) => console.log(req.file));  
router.put('/name', chatAdminMiddleware, chatController.changeName);
router.put('/users/add/:chatId', chatAdminMiddleware, chatController.addUser);
router.put('/users/remove/:chatId', chatAdminMiddleware, chatController.removeUser);
router.put('/leave', authMiddleware, chatController.leaveChat);
router.delete('/:chatId', chatAdminMiddleware, chatController.delete);

export default router