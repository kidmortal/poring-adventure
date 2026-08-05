import cn from 'classnames';

import ForEach from '../../shared/ForEach';
import { When } from '../../shared/When';
import styles from './style.module.scss';
import { BattleEffect } from './effects';

/**
 * Everything riding on one combatant, in a single row.
 *
 * Buffs and debuffs used to be two rows of different sizes, which made a
 * player's effects look like a different kind of thing from the monster's when
 * they are the same kind of thing — and cost a row of height per side on a
 * screen that has none to spare. One row, one size, and the turns left on the
 * corner of every icon: colour is what separates help from harm.
 */
export function EffectList({ effects }: { effects: BattleEffect[] }) {
  if (effects.length === 0) return <></>;

  return (
    <div className={styles.container}>
      <ForEach
        items={effects}
        render={(effect, index) => (
          <div
            key={`${effect.name}-${index}`}
            className={cn(styles.effect, styles[effect.tone])}
            title={`${effect.name} · ${effect.duration} turns`}
          >
            <img width={20} height={20} src={effect.image} alt={effect.name} />
            {/* A barrier is worth what is left in it, so that number wins the
                corner: the icon alone reads as "protected" long after the pool
                has been spent down to nothing. */}
            <When value={effect.barrier !== undefined}>
              <span className={cn(styles.count, styles.barrier)}>{effect.barrier}</span>
            </When>
            <When value={effect.barrier === undefined}>
              <span className={styles.count}>{effect.duration}</span>
            </When>
          </div>
        )}
      />
    </div>
  );
}
