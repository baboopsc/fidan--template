import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { registerThunk } from '../../store/auth/authSlice.js';
import { registerSchema } from '../../validation/authSchemas.js';
import PasswordInput from '../PasswordInput/PasswordInput.jsx';
import styles from './RegisterForm.module.css';

function RegisterForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(registerSchema) });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await dispatch(registerThunk(data)).unwrap();
      navigate('/home', { replace: true });
    } catch (message) {
      setServerError(typeof message === 'string' ? message : 'Registration failed');
    }
  };

  return (
    <form className={styles.registerForm} onSubmit={handleSubmit(onSubmit)} noValidate>
      <h2 className={styles.visuallyHidden}>Registration</h2>

      <div className={styles.field}>
        <input type="text" placeholder="Name" autoComplete="name" {...register('name')} />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>

      <div className={styles.field}>
        <input type="email" placeholder="Email" autoComplete="email" {...register('email')} />
        {errors.email && <span className={styles.error}>{errors.email.message}</span>}
      </div>

      <div className={styles.field}>
        <PasswordInput
          registration={register('password')}
          error={errors.password?.message}
          autoComplete="new-password"
        />
      </div>

      {serverError && (
        <p className={`${styles.error} ${styles.errorServer}`}>{serverError}</p>
      )}

      <button type="submit" className={styles.submit} disabled={isSubmitting}>
        Register Now
      </button>
    </form>
  );
}

export default RegisterForm;
