import { Router } from "express";
import userController from "../controllers/userController.js";

const router = new Router();

router.get('/:userId');
router.post('/registration', userController.registration);
router.post('/login', userController.login);
router.patch('/:userId');
router.delete('/:userId');

export default router