import ForEach from '@/components/shared/ForEach';
import styles from './style.module.scss';
import { When } from '@/components/shared/When';

type Props = {
  logs?: BattleLog[];
};

export function BattleLogs({ logs }: Props) {
  return (
    <div className={styles.logContainer}>
      <ForEach
        items={logs}
        render={(log, idx) => (
          <div key={`${log.message}${idx}`}>
            <When value={!!log.icon}>
              <img width={20} height={20} src={log.icon} />
            </When>
            <span key={`${log}${idx}`}>{log.message}</span>
          </div>
        )}
      />
    </div>
  );
}
