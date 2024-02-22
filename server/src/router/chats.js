import { Router } from "express";

const router = new Router();

router.get('/');
router.get('/:chatId');
router.post('/');
router.patch('/:chatId');
router.delete('/:chatId');

export default router