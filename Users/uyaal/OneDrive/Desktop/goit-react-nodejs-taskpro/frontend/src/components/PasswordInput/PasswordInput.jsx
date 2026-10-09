import { useState } from 'react';
import styles from './PasswordInput.module.css';

function PasswordInput({ registration, placeholder = 'Password', error, autoComplete, className = '' }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className={styles.passwordInput}>
      <input
        className={className}
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        autoComplete={autoComplete}
        {...registration}
      />
      <button
        type="button"
        className={styles.toggle}
        onClick={() => setVisible((prev) => !prev)}
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M2 12s3.5-7 10-7c2 0 3.7.6 5.1 1.4M22 12s-3.5 7-10 7c-2 0-3.7-.6-5.1-1.4" />
            <path d="M3 3l18 18" />
          </svg>
        )}
      </button>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export default PasswordInput;
