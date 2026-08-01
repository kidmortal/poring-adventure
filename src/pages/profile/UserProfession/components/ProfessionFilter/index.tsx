import cn from 'classnames';
import styles from './style.module.scss';

import ForEach from '@/components/shared/ForEach';

export type ProfessionFilterValue = number | 'all';

type Props = {
  /** The trades to filter by — the hiring board only ever shows crafting ones. */
  professions: Profession[];
  selected: ProfessionFilterValue;
  onSelect: (value: ProfessionFilterValue) => void;
};

/** Icon tabs over the hiring board: all, or one trade at a time. */
export function ProfessionFilter({ professions, selected, onSelect }: Props) {
  return (
    <div className={styles.container}>
      <button
        type="button"
        className={cn(styles.filter, { [styles.selected]: selected === 'all' })}
        onClick={() => onSelect('all')}
      >
        <span className={styles.icon}>🧰</span>
        <span className={styles.label}>All</span>
      </button>

      <ForEach
        items={professions}
        render={(profession) => (
          <button
            key={profession.id}
            type="button"
            className={cn(styles.filter, { [styles.selected]: selected === profession.id })}
            onClick={() => onSelect(profession.id)}
          >
            <span className={styles.icon}>{profession.icon}</span>
            <span className={styles.label}>{profession.name}</span>
          </button>
        )}
      />
    </div>
  );
}
