import { Router } from 'express';
import { sendHelpRequest } from '../controllers/needHelp.js';

const router = Router();

router.post('/', sendHelpRequest);

export default router;
