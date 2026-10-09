import { Router } from 'express';
import multer from 'multer';
import createHttpError from 'http-errors';
import {
  register,
  login,
  logout,
  getCurrentUser,
  updateUser,
} from '../controllers/authControllers.js';
import { validateBody } from '../middlewares/validateBody.js';
import { authenticate } from '../middlewares/authenticate.js';
import { upload } from '../middlewares/multer.js';
import {
  registerSchema,
  loginSchema,
  updateUserSchema,
} from '../validation/authValidation.js';

const router = Router();

const uploadAvatar = (req, res, next) => {
  upload.single('avatar')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return next(createHttpError(400, err.message));
    }
    if (err) {
      return next(err);
    }
    next();
  });
};

router.post('/register', validateBody(registerSchema), register);
router.post('/login', validateBody(loginSchema), login);
router.post('/logout', authenticate, logout);
router.get('/current', authenticate, getCurrentUser);
router.patch(
  '/current',
  authenticate,
  uploadAvatar,
  validateBody(updateUserSchema),
  updateUser,
);

export default router;
