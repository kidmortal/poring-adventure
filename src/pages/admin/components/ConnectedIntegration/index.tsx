import { When } from '@/components/When';
import styles from './style.module.scss';
import { FaDiscord } from 'react-icons/fa';
import { VscDebugDisconnect } from 'react-icons/vsc';

export function ConnectedIntegration({ integration }: { integration?: string }) {
  return (
    <div className={styles.integrationContainer}>
      <When value={integration === 'discord'}>
        <FaDiscord size={24} />
      </When>
      <VscDebugDisconnect size={24} />
    </div>
  );
}
