import { useParams, Navigate, Link } from 'react-router-dom';
import LoginForm from '../components/LoginForm/LoginForm.jsx';
import RegisterForm from '../components/RegisterForm/RegisterForm.jsx';
import styles from './AuthPage.module.css';

function AuthPage() {
  const { id } = useParams();

  if (id !== 'login' && id !== 'register') {
    return <Navigate to="/auth/login" replace />;
  }

  return (
    <main className={styles.authPage}>
      <div className={styles.card}>
        <nav className={styles.tabs} aria-label="Authentication">
          <Link
            to="/auth/register"
            className={id === 'register' ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            aria-current={id === 'register' ? 'page' : undefined}
          >
            Registration
          </Link>
          <Link
            to="/auth/login"
            className={id === 'login' ? `${styles.tab} ${styles.tabActive}` : styles.tab}
            aria-current={id === 'login' ? 'page' : undefined}
          >
            Log In
          </Link>
        </nav>

        {id === 'login' ? <LoginForm /> : <RegisterForm />}
      </div>
    </main>
  );
}

export default AuthPage;
