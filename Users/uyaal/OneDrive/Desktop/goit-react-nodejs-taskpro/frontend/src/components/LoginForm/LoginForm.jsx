import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { loginThunk } from '../../store/auth/authSlice.js';
import { loginSchema } from '../../validation/authSchemas.js';
import PasswordInput from '../PasswordInput/PasswordInput.jsx';
import styles from './LoginForm.module.css';

function LoginForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await dispatch(loginThunk(data)).unwrap();
      navigate('/home', { replace: true });
    } catch (message) {
      setServerError(typeof message === 'string' ? message : 'Login failed');
    }
  };

  return (
    <form className={styles.loginForm} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className={styles.visuallyHidden}>Login</h2>

      <div className={styles.field}>
        <input type="email" placeholder="Email" autoComplete="email" {...register('email')} />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
        <PasswordInput
          registration={register('password')}
          error={errors.password?.message}
          autoComplete="current-password"
        />
      </div>

      {serverError && <p className={`${styles.error} ${styles.errorServer}`}>{serverError}</p>}

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        Log In Now
      </button>
    </form>
  );
}

export default LoginForm;
