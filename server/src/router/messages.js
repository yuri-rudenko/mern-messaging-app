import { Router } from "express";

const router = new Router();

router.get('/:messageId');
router.post('/');
router.patch('/:messageId');
router.delete('/:messageId');

export default router