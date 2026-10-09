import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch } from 'react-redux';

import { useAuth } from '../../hooks/useAuth.js';
import { updateUserThunk } from '../../store/auth/authSlice.js';
import { updateProfileSchema } from '../../validation/authSchemas.js';
import { getAvatarUrl } from '../../utils/avatar.js';
import PasswordInput from '../PasswordInput/PasswordInput.jsx';
import './EditProfileModal.css';

function EditProfileModal({ onClose }) {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(getAvatarUrl(user));
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(updateProfileSchema),
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    return () => {
      if (avatarFile) URL.revokeObjectURL(avatarPreview);
    };
  }, [avatarFile, avatarPreview]);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const handleAvatarChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const onSubmit = async (data) => {
    setServerError('');
    const formData = new FormData();
    if (avatarFile) formData.append('avatar', avatarFile);
    if (data.name && data.name !== user?.name) formData.append('name', data.name);
    if (data.email && data.email !== user?.email) formData.append('email', data.email);
    if (data.password) formData.append('password', data.password);

    if (![...formData.keys()].length) {
      onClose();
      return;
    }

    try {
      await dispatch(updateUserThunk(formData)).unwrap();
      onClose();
    } catch (message) {
      setServerError(typeof message === 'string' ? message : 'Update failed');
    }
  };

  return (
    <div className="edit-profile-backdrop" role="presentation" onMouseDown={onClose}>
      <form
        className="edit-profile-modal"
        aria-label="Edit profile"
        onSubmit={handleSubmit(onSubmit)}
        onMouseDown={(event) => event.stopPropagation()}
        noValidate
      >
        <button className="modal-close-button" type="button" aria-label="Close modal" onClick={onClose}>
          <svg width="18" height="18" aria-hidden="true">
            <use href="/symbol-defs.svg#icon-close" />
          </svg>
        </button>

        <h2 className="edit-profile-title">Edit Profile</h2>

        <label className="avatar-picker">
          <img src={avatarPreview} alt="Avatar preview" className="avatar-preview" />
          <span className="avatar-edit-icon" aria-hidden="true">+</span>
          <input type="file" accept="image/*" onChange={handleAvatarChange} hidden />
        </label>

        <div className="edit-profile-field">
          <input
            className="edit-profile-input"
            type="text"
            placeholder="Name"
            {...register('name')}
          />
          {errors.name && <span className="edit-profile-error">{errors.name.message}</span>}
        </div>

        <div className="edit-profile-field">
          <input
            className="edit-profile-input"
            type="email"
            placeholder="Email"
            {...register('email')}
          />
          {errors.email && <span className="edit-profile-error">{errors.email.message}</span>}
        </div>

        <div className="edit-profile-field">
          <PasswordInput
            className="edit-profile-password-input"
            registration={register('password')}
            placeholder="New Password (leave blank to keep current)"
            error={errors.password?.message}
            autoComplete="new-password"
          />
        </div>

        <div className="edit-profile-field">
          <PasswordInput
            className="edit-profile-password-input"
            registration={register('confirmPassword')}
            placeholder="Confirm New Password"
            error={errors.confirmPassword?.message}
            autoComplete="new-password"
          />
        </div>

        {serverError && <p className="edit-profile-error edit-profile-error-server">{serverError}</p>}

        <button className="edit-profile-submit" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </form>
    </div>
  );
}

export default EditProfileModal;
