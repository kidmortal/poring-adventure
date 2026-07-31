import cn from 'classnames';
import styles from './style.module.scss';

export type TabOption<T extends string> = {
  value: T;
  label: string;
  /** Shown as a pill next to the label, e.g. a pending request count. */
  badge?: number;
};

type Props<T extends string> = {
  options: TabOption<T>[];
  selected: T;
  onSelect: (value: T) => void;
};

/** Segmented control for three or more views. Use Switch for exactly two. */
export function Tabs<T extends string>({ options, selected, onSelect }: Props<T>) {
  return (
    <div className={styles.container}>
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          className={cn(styles.tab, { [styles.selected]: option.value === selected })}
          onClick={() => onSelect(option.value)}
        >
          <span className={styles.label}>{option.label}</span>
          {!!option.badge && <span className={styles.badge}>{option.badge}</span>}
        </button>
      ))}
    </div>
  );
}
