import { useMainStore } from '@/store/main';
import styles from './style.module.scss';
import { GoogleLoginButton } from '@/components/GoogeLoginButton';
import { When } from '@/components/shared/When';

/** The first screen anyone sees, so it carries the game's face and little else. */
export function LoginPage() {
  const store = useMainStore();

  return (
    <When value={!store.loggedUserInfo.loggedIn}>
      <div className={styles.container}>
        <div className={styles.hero}>
          <img
            className={styles.logo}
            src="https://kidmortal.sirv.com/misc/poring_adventure.png?q=20"
            alt="Poring Adventure"
          />
          <span className={styles.tagline}>Gather, craft and fight together</span>
        </div>

        <div className={styles.panel}>
          <span className={styles.panelTitle}>Sign in to play</span>
          <GoogleLoginButton onSuccess={() => {}} />
          <span className={styles.legal}>Your account only identifies your character.</span>
        </div>
      </div>
    </When>
  );
}
