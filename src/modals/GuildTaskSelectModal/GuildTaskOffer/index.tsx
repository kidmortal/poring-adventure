import styles from './style.module.scss';
import { Button } from '@/components/shared/Button';

type Props = {
  task: GuildTask;
  disabled?: boolean;
  onSelect: () => void;
};

/**
 * A task the guild can take on. Unlike GuildTaskInfo, which tracks an accepted
 * task's progress, this shows what the task would involve before accepting.
 *
 * One row per offer: the list is a menu to compare and pick from, so what
 * matters is seeing several at once, not seeing one in detail.
 */
export function GuildTaskOffer({ task, disabled, onSelect }: Props) {
  return (
    <article className={styles.card}>
      <img className={styles.sprite} src={task.image || task.target?.image} alt={task.name} />

      <div className={styles.details}>
        <h3 className={styles.taskName}>{task.name}</h3>
        <div className={styles.meta}>
          <span className={styles.mapName}>{task.target?.name}</span>
          <span className={styles.separator}>·</span>
          <span className={styles.kills}>{task.killCount} kills</span>
          <span className={styles.separator}>·</span>
          <span className={styles.reward}>
            <img
              className={styles.rewardIcon}
              src="https://kidmortal.sirv.com/misc/soulshard.webp?w=20&h=20"
              alt="task points"
            />
            {task.taskPoints}
          </span>
        </div>
      </div>

      <Button className={styles.accept} label="Accept" onClick={onSelect} disabled={disabled} />
    </article>
  );
}
