import cn from 'classnames';

import { When } from '@/components/shared/When';
import styles from './style.module.scss';
import { EffectList } from '@/components/StatsComponents/EffectList';
import { buffEffects, debuffEffects } from '@/components/StatsComponents/EffectList/effects';
import { StatBar } from '@/components/StatsComponents/StatBar';

/** What is left of a monster once it stops being one. */
const GRAVE_IMAGE = 'https://kidmortal.sirv.com/misc/rip.webp';

type Props = {
  monster?: Monster;
  /** Marked as what the next swing lands on. */
  selected?: boolean;
  onClick?: () => void;
};

export function BattleMonsterInfo({ monster, selected, onClick }: Props) {
  if (!monster) return <></>;

  const isDead = monster.health <= 0;
  const effects = [...buffEffects(monster.buffs), ...debuffEffects(monster.debuffs)];

  return (
    <button
      type="button"
      // A corpse is not a target: it keeps its name so the party can still read
      // what the pack was, and stops being clickable so a mistap cannot throw a
      // turn at something already dead.
      disabled={isDead}
      onClick={onClick}
      className={cn(styles.monsterContainer, { [styles.selected]: selected && !isDead, [styles.dead]: isDead })}
    >
      <div className={styles.levelContainer}>
        <When value={monster.boss && !isDead}>
          <img width={20} height={20} src="https://kidmortal.sirv.com/misc/boss.webp" />
        </When>
        <When value={!isDead}>
          <span>LV {monster.level}</span>
        </When>
      </div>
      <span className={styles.monsterName}>{monster.name}</span>

      {/* A bar rather than a number, because what matters mid-fight is how much
          of it is left, not the figure — and the attack is gone with it: it was
          a constant the player could do nothing about, sitting where the one
          changing number belongs. `maxHealth` is what it stood up with. A dead
          one has no bar at all: an empty bar still reads as a combatant. */}
      <When value={!isDead}>
        <div className={styles.healthBar}>
          {/* Not `HealthBar`: its "HP" prefix costs three characters of a bar this
              narrow, and a guild boss's five-digit pool would clip. The bar is red
              and sits under a monster — nothing else it could be counting. */}
          <StatBar
            variant="health"
            percentage={Math.floor((monster.health / (monster.maxHealth || monster.health || 1)) * 100)}
            label={`${monster.health}/${monster.maxHealth ?? monster.health}`}
          />
        </div>

        {/* Everything riding on it, in one row: what the party stuck on it and
            what it is wearing itself, told apart by the colour of the count. */}
        <EffectList effects={effects} />
      </When>

      <img
        className={styles.sprite}
        src={isDead ? GRAVE_IMAGE : monster.image}
        alt={isDead ? `${monster.name}, dead` : monster.name}
      />
    </button>
  );
}
