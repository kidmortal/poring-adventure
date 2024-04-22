import { Button } from '../../components/shared/Button';
import styles from './style.module.scss';

export function WebsocketDisconnectedMessageScreen(props: { onReconnect: () => void }) {
  return (
    <div className={styles.container}>
      <div className={styles.imageMessageContainer}>
        <img alt="poring" src={'https://kidmortal.sirv.com/icons/crying_poring.webp'} />
        <div className={styles.messageContainer}>
          <h1>Connection lost</h1>
        </div>
      </div>

      <Button theme="danger" label="Reconnect" onClick={props.onReconnect} />
    </div>
  );
}
