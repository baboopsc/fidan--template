import { Router } from 'express';
import {
  getWorkspaceController,
  saveWorkspaceController,
} from '../controllers/workspaceController.js';
import { authenticate } from '../middlewares/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', getWorkspaceController);
router.put('/', saveWorkspaceController);

export default router;
