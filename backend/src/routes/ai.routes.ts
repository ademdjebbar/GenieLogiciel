import { Router } from 'express';
import { AIController } from '../controllers/ai.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/chat', requireAuth, AIController.chat);

export default router;
