import { Button } from '../../components/shared/Button';
import styles from './style.module.scss';

export function WebsocketDisconnectedMessageScreen(props: { onReconnect: () => void }) {
  return (
    <div className={styles.container}>
      <div className={styles.panel}>
        <img className={styles.poring} alt="poring" src="https://kidmortal.sirv.com/icons/crying_poring.webp" />
        <h1 className={styles.title}>Connection lost</h1>
        <span className={styles.subtitle}>The server stopped answering. Your progress is safe.</span>
        <Button label="Reconnect" onClick={props.onReconnect} />
      </div>
    </div>
  );
}
