import { Router } from "express";
import chatAdminMiddleware from "../middleware/chatAdminMiddleware.js";
import chatController from "../controllers/chatController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import multer from "multer";
import storage from "../storage.js";
import fileController from "../controllers/fileController.js";
import checkFileTypeMiddleware from "../middleware/checkFileTypeMiddleware.js";

const router = new Router();

const image = multer({storage: storage(), 
    fileFilter: function(req, file, cb) {
    checkFileTypeMiddleware(req, file, cb);
}})

const file = multer({storage: storage()})

router.post('/uploadImage', image.single('file'), fileController.uploadImage);
router.post('/uploadFile', file.single('file'), fileController.uploadImage);
router.delete('/deleteImage', fileController.deleteImage);

export default router;
