import { Router } from 'express';
import {
  createTaskController,
  updateTaskController,
  deleteTaskController,
  getTasksController,
} from '../controllers/taskController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();
router.use(authenticate);

router.post('/', createTaskController);
router.get('/', getTasksController);
router.patch('/:id', updateTaskController);
router.delete('/:id', deleteTaskController);

export default router;
