import { Link } from 'react-router-dom';
import LogoComponent from '../components/LogoComponent/LogoComponent.jsx';
import heroIllustration from '../assets/hero-illustration.webp';
import heroIllustrationx2 from '../assets/hero-illustration@2.webp';
import styles from './WelcomePage.module.css';

function WelcomePage() {
  return (
    <main className={styles.welcomePage}>
      <img
        className={styles.hero}
        srcSet={`${heroIllustration} 1x, ${heroIllustrationx2} 2x`}
        src={heroIllustration}
        width={162}
        height={162}
        alt="Person working on a laptop"
      />

      <LogoComponent />

      <p className={styles.description}>
        Supercharge your productivity and take control of your tasks with Task
        Pro - Don't wait, start achieving your goals now!
      </p>

      <div className={styles.actions}>
        <Link to="/auth/register" className={styles.buttonPrimary}>
          Registration
        </Link>
        <Link to="/auth/login" className={styles.buttonLink}>
          Log In
        </Link>
      </div>
    </main>
  );
}

export default WelcomePage;
