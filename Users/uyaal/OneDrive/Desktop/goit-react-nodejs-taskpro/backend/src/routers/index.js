import { Router } from "express";
import helpRouter from "./needHelp.js";
import authRouter from "./authRouter.js";
import taskRouter from "./taskRouter.js";
import workspaceRouter from './workspaceRouter.js';

const router = Router();

router.get('/', (req, res) => {
  res.json({
    message: 'TaskPro API is running',
  });
});

router.use('/api/auth', authRouter);
router.use('/api/tasks', taskRouter);
router.use('/api/workspace', workspaceRouter);
router.use('/help', helpRouter);

export default router;
