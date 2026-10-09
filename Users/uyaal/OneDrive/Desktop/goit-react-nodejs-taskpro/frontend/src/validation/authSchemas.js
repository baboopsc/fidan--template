import * as yup from 'yup';
import { EMAIL_REGEXP, PASSWORD_REGEXP, NAME_REGEXP } from '../utils/regex.js';

const email = yup
  .string()
  .required('Email is required')
  .matches(EMAIL_REGEXP, 'Enter a valid email address');

const password = yup
  .string()
  .required('Password is required')
  .matches(
    PASSWORD_REGEXP,
    'Password must be 8-64 characters, with no spaces, and include at least one letter'
  );

const name = yup
  .string()
  .required('Name is required')
  .matches(NAME_REGEXP, 'Name must be 2-32 characters long');

export const loginSchema = yup.object({ email, password });

export const registerSchema = yup.object({ name, email, password });

const optionalName = yup
  .string()
  .transform((value) => (value === '' ? undefined : value))
  .optional()
  .matches(NAME_REGEXP, { message: 'Name must be 2-32 characters long', excludeEmptyString: true });

const optionalEmail = yup
  .string()
  .transform((value) => (value === '' ? undefined : value))
  .optional()
  .matches(EMAIL_REGEXP, { message: 'Enter a valid email address', excludeEmptyString: true });

const optionalPassword = yup
  .string()
  .transform((value) => (value === '' ? undefined : value))
  .optional()
  .matches(PASSWORD_REGEXP, {
    message: 'Password must be 8-64 characters, with no spaces, and include at least one letter',
    excludeEmptyString: true,
  });

const confirmPassword = yup
  .string()
  .transform((value) => (value === '' ? undefined : value))
  .test('passwords-match', 'Passwords must match', function (value) {
    const { password } = this.parent;
    return (password || '') === (value || '');
  });

export const updateProfileSchema = yup.object({
  name: optionalName,
  email: optionalEmail,
  password: optionalPassword,
  confirmPassword,
});
