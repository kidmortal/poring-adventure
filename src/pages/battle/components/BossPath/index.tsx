import cn from 'classnames';
import { FaCheck, FaLock } from 'react-icons/fa';

import styles from './style.module.scss';
import { stageState } from '../../dungeon';

type Props = {
  monsters: DungeonMonster[];
  /** The run in progress, when there is one — it colours the path. */
  run?: DungeonRun | null;
  onSelect: (monster: DungeonMonster) => void;
};

/**
 * The road through a dungeon: every boss in the order it is fought, joined by
 * the line the party walks along it.
 *
 * The order is the whole point of drawing it. Three bosses in a list are three
 * choices; three bosses on a line are a gauntlet, and the last node being the
 * biggest is what says where the run is actually going.
 */
export function BossPath({ monsters, run, onSelect }: Props) {
  const path = [...monsters].sort((a, b) => a.stage - b.stage);

  return (
    <div className={styles.path}>
      {path.map((monster, index) => {
        const state = stageState(monster.stage, run);
        const isFinal = index === path.length - 1;

        return (
          <div className={styles.node} key={monster.id}>
            {/* The line reaches back to the boss before it, so the first node
                has nothing to draw and the run's progress fills the rest. */}
            {index > 0 && (
              <span
                className={cn(styles.link, {
                  [styles.linkWalked]: state === 'cleared' || state === 'next',
                })}
              />
            )}

            <button
              type="button"
              className={cn(styles.boss, styles[state], { [styles.finalBoss]: isFinal })}
              onClick={() => onSelect(monster)}
              title={monster.name}
            >
              <span className={styles.stageMark}>{monster.stage}</span>
              <img className={styles.sprite} src={monster.image} alt={monster.name} />
              {state === 'cleared' && (
                <span className={cn(styles.state, styles.stateCleared)}>
                  <FaCheck />
                </span>
              )}
              {state === 'locked' && !!run && (
                <span className={cn(styles.state, styles.stateLocked)}>
                  <FaLock />
                </span>
              )}
            </button>

            <span className={cn(styles.name, { [styles.finalName]: isFinal })}>{monster.name}</span>
            <span className={styles.level}>Lv {monster.level}</span>
            {/* The last one is the reason to be here, and it is worth saying so
                before the party spends the day's entry finding out. */}
            {isFinal && <span className={styles.finalTag}>Final</span>}
          </div>
        );
      })}
    </div>
  );
}
