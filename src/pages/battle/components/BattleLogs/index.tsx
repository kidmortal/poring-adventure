import cn from 'classnames';

import ForEach from '@/components/shared/ForEach';
import styles from './style.module.scss';

type Props = {
  logs?: BattleLog[];
};

/**
 * The blow-by-blow. It is column-reversed, so the newest line sits at the top
 * of the box and older ones fade back behind it.
 */
export function BattleLogs({ logs }: Props) {
  const lastIndex = (logs?.length ?? 0) - 1;

  return (
    <div className={styles.logContainer}>
      <ForEach
        items={logs}
        render={(log, idx) => (
          <div key={`${log.message}${idx}`} className={cn(styles.line, { [styles.latest]: idx === lastIndex })}>
            <span className={styles.iconSlot}>{!!log.icon && <img src={log.icon} alt="" />}</span>
            <span className={styles.message}>{log.message}</span>
          </div>
        )}
      />
    </div>
  );
}
