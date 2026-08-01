import { ReactNode } from 'react';
import styles from './style.module.scss';

import { Button } from '@/components/shared/Button';
import { When } from '@/components/shared/When';

type Props = {
  /** Emoji of the owning profession — the artwork placeholder used everywhere. */
  icon: string;
  title: string;
  subtitle: string;
  staminaCost: number;
  experience: number;
  children: ReactNode;
  actionLabel: string;
  /** Why the action cannot be taken; when set the button is disabled. */
  blockedReason?: string;
  busy?: boolean;
  /** Outcome of the last run, e.g. what a gather dropped. */
  result?: ReactNode;
  onAction: () => void;
};

/** Shared shell for a gathering node and a crafting recipe — both are one
 * stamina-priced action with an item list and a single button. */
export function ActionCard(props: Props) {
  const blocked = !!props.blockedReason;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.icon}>{props.icon}</span>
        <div className={styles.headerText}>
          <h3>{props.title}</h3>
          <span className={styles.subtitle}>{props.subtitle}</span>
        </div>
        <div className={styles.cost}>
          <span className={styles.stamina}>{props.staminaCost} stamina</span>
          <span className={styles.experience}>+{props.experience} exp</span>
        </div>
      </div>

      <div className={styles.body}>{props.children}</div>

      <When value={!!props.result}>
        <div className={styles.result}>{props.result}</div>
      </When>

      <Button
        label={blocked ? props.blockedReason : props.actionLabel}
        theme={blocked ? 'neutral' : 'primary'}
        disabled={blocked || props.busy}
        onClick={props.onAction}
      />
    </div>
  );
}
