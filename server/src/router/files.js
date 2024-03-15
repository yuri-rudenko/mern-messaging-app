import { Router } from "express";
import chatAdminMiddleware from "../middleware/chatAdminMiddleware.js";
import chatController from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import storage, { checkFileType } from "../storage.js";
import fileController from "../controllers/fileController.js";

const router = new Router();

const image = multer({storage: storage(), 
    fileFilter: function(req, file, cb) {
    checkFileType(req, file, cb);
}})

router.post('/uploadImage', image.single('file'), fileController.uploadImage);
router.delete('/deleteImage', fileController.deleteImage);

export default router;
