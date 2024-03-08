import { Router } from "express";
import chatAdminMiddleware from "../middleware/chatAdminMiddleware.js";
import chatController from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import storage, { checkFileType } from "../storage.js";

const router = new Router();

const chatPfp = multer({storage: storage(), 
    fileFilter: function(req, file, cb) {
    checkFileType(req, file, cb);
}})

router.get('/', chatController.getAll);
router.get('/:chatId', chatController.getOne);
router.post('/', authMiddleware, chatController.create);
router.post('/uploadPfp',chatPfp.single('file'), chatController.uploadChatPfp); // not update or change, used on creation
router.put('/name', chatAdminMiddleware, chatController.changeName);
router.put('/users/add/:chatId', chatAdminMiddleware, chatController.addUser);
router.put('/users/remove/:chatId', chatAdminMiddleware, chatController.removeUser);
router.put('/leave', authMiddleware, chatController.leaveChat);
router.delete('/:chatId', chatAdminMiddleware, chatController.delete);

export default router