import styles from './style.module.scss';
import ForEach from '@/components/shared/ForEach';
import { Button } from '@/components/shared/Button';
import { MonsterChip } from '@/components/Monsters/MonsterChip';
import { When } from '@/components/shared/When';

type Props = {
  task: GuildTask;
  disabled?: boolean;
  onSelect: () => void;
};

/**
 * A task the guild can take on. Unlike GuildTaskInfo, which tracks an accepted
 * task's progress, this shows what the task would involve before accepting.
 */
export function GuildTaskOffer({ task, disabled, onSelect }: Props) {
  const monsters = task.target?.monster ?? [];
  const hasBoss = monsters.some((monster) => monster.boss);

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <img className={styles.mapImage} src={task.target?.image} alt={task.target?.name} />
        <div className={styles.headerText}>
          <h3 className={styles.taskName}>{task.name}</h3>
          <span className={styles.mapName}>{task.target?.name}</span>
        </div>
        <div className={styles.badges}>
          <When value={hasBoss}>
            <span className={styles.bossBadge}>Boss</span>
          </When>
        </div>
      </header>

      <div className={styles.objectiveRow}>
        <span className={styles.objectiveLabel}>Defeat</span>
        <span className={styles.objectiveValue}>{task.killCount}</span>
        <span className={styles.objectiveLabel}>monsters</span>
      </div>

      <When value={monsters.length > 0}>
        <section className={styles.section}>
          <span className={styles.sectionTitle}>Targets</span>
          <div className={styles.monsterGrid}>
            <ForEach items={monsters} render={(monster) => <MonsterChip key={monster.id} monster={monster} />} />
          </div>
        </section>
      </When>

      <div className={styles.rewardRow}>
        <span className={styles.sectionTitle}>Reward</span>
        <div className={styles.rewardValue}>
          <img width={18} height={18} src="https://kidmortal.sirv.com/misc/soulshard.webp?w=20&h=20" />
          <span>{task.taskPoints} task points</span>
        </div>
      </div>

      <Button label="Accept task" onClick={onSelect} disabled={disabled} />
    </article>
  );
}
