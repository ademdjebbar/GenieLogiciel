import { Router } from 'express';
import { TaskController } from '../controllers/task.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Toutes les routes de tâches exigent d'être authentifié
router.use(requireAuth);

router.get('/', TaskController.list);
router.post('/', TaskController.create);
router.patch('/:id/status', TaskController.updateStatus);
router.patch('/:id', TaskController.update);
router.delete('/:id', TaskController.delete);
router.patch('/subtasks/:subTaskId', TaskController.toggleSubTask);

export default router;
