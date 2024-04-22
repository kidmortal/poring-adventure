import { Updater } from '@/config/updater';
import { Button } from '../../components/shared/Button';
import styles from './style.module.scss';

export function UpdateAvailableMessageScreen(props: { onCancelUpdate: () => void }) {
  return (
    <div className={styles.container}>
      <div className={styles.imageMessageContainer}>
        <img alt="poring" src={'https://kidmortal.sirv.com/icons/smug_poring.webp'} />
        <div className={styles.messageContainer}>
          <h1>An Update is available on store</h1>
        </div>
      </div>

      <Button label="Update Now" onClick={() => Updater.performImmediateUpdate()} />
      <Button theme="danger" label="Update later (App might not work)" onClick={() => props.onCancelUpdate()} />
    </div>
  );
}
