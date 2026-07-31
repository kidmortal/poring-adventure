import styles from './style.module.scss';
import cn from 'classnames';

export type StatBarVariant = 'health' | 'mana' | 'experience';

type Props = {
  variant: StatBarVariant;
  /** Filled portion, 0-100. Values outside the range are clamped. */
  percentage: number;
  label: string;
  minWidth?: string;
  minHeight?: string;
};

/**
 * Shared fill bar behind HealthBar / ManaBar / ExperienceBar — they only differ
 * by colour, height and label.
 */
export function StatBar({ variant, percentage, label, minWidth, minHeight }: Props) {
  const width = Math.min(Math.max(percentage, 0), 100);

  return (
    <div className={cn(styles.container, styles[variant])} style={{ minWidth, minHeight }}>
      <span>{label}</span>
      <div style={{ width: `${width}%` }} className={styles.fillColor} />
    </div>
  );
}
