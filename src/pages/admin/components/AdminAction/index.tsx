import cn from 'classnames';
import styles from './style.module.scss';
import { Theme } from '@/types/ui';

type Props = {
  icon: React.ReactNode;
  label: string;
  /** What it does, in a few words — these are destructive more often than not. */
  hint?: string;
  theme?: Theme;
  pending?: boolean;
  onClick: () => void;
};

/**
 * One admin action. Wider than a plain button because what these do is worth
 * spelling out before it is pressed.
 */
export function AdminAction({ icon, label, hint, theme = 'neutral', pending, onClick }: Props) {
  return (
    <button
      type="button"
      className={cn(styles.action, styles[theme], { [styles.pending]: pending })}
      disabled={pending}
      onClick={onClick}
    >
      <span className={styles.icon}>{icon}</span>
      <span className={styles.text}>
        <span className={styles.label}>{label}</span>
        {hint && <span className={styles.hint}>{hint}</span>}
      </span>
    </button>
  );
}
