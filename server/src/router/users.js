import { Router } from "express";

const router = new Router();

router.get('/:userId');
router.post('/');
router.patch('/:userId');
router.delete('/:userId');

export default router