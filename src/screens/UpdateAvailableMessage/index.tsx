import { Updater } from '@/config/updater';
import { Button } from '../../components/shared/Button';
import styles from './style.module.scss';

export function UpdateAvailableMessageScreen(props: { onCancelUpdate: () => void }) {
  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <img className={styles.poring} alt="poring" src="https://kidmortal.sirv.com/icons/smug_poring.webp" />
        <h1 className={styles.title}>Update available</h1>
        <span className={styles.subtitle}>A new version is on the store. The old one may not work with the server.</span>

        <div className={styles.actions}>
          <Button label="Update now" onClick={() => Updater.performImmediateUpdate()} />
          <Button theme="neutral" label="Later" onClick={() => props.onCancelUpdate()} />
        </div>
      </div>
    </div>
  );
}
