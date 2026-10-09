import Joi from 'joi';
import { REGEXP } from '../constants/index.js';

const nameField = Joi.string().pattern(REGEXP.NAME).messages({
  'string.pattern.base': 'Name must be 2-32 characters long',
});

const emailField = Joi.string().pattern(REGEXP.EMAIL).messages({
  'string.pattern.base': 'Email must contain a single "@" and a "." in the domain part',
});

const passwordField = Joi.string().pattern(REGEXP.PASSWORD).messages({
  'string.pattern.base':
    'Password must be 8-64 characters, contain no spaces, and include at least one letter',
});

export const registerSchema = Joi.object({
  name: nameField.required(),
  email: emailField.required(),
  password: passwordField.required(),
});

export const loginSchema = Joi.object({
  email: emailField.required(),
  password: passwordField.required(),
});

// No .min(1): a request may carry only the avatar file, leaving req.body empty.
// "at least one change" is enforced in authService.updateUserProfile once req.file is known too.
export const updateUserSchema = Joi.object({
  name: nameField,
  email: emailField,
  password: passwordField,
  theme: Joi.string().valid('light', 'dark', 'violet'),
});
