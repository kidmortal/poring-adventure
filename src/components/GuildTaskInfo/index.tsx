import styles from './style.module.scss';
import { When } from '../shared/When';
import cn from 'classnames';

type Props = {
  guildTask?: CurrentGuildTask;
  finished?: boolean;
  onClick?: () => void;
};

/** The guild's accepted task, with progress. Offers live in GuildTaskOffer. */
export function GuildTaskInfo(props: Props) {
  const task = props.guildTask?.task;
  if (!task) return <></>;

  const totalKills = task.killCount ?? 0;
  const remainingKills = props.guildTask?.remainingKills ?? 0;
  const killedMonsters = totalKills - remainingKills;
  const progress = totalKills > 0 ? Math.min((killedMonsters / totalKills) * 100, 100) : 0;

  return (
    <div
      onClick={props.onClick}
      className={cn(styles.guildTaskContainer, {
        [styles.completed]: props.finished,
      })}
    >
      <header className={styles.header}>
        <img className={styles.mapImage} src={task.target?.image} alt={task.target?.name} />
        <div className={styles.headerText}>
          <h3 className={styles.taskName}>{task.name}</h3>
          <span className={styles.mapName}>{task.target?.name}</span>
        </div>
        <When value={props.finished ?? false}>
          <span className={styles.completedLabel}>Finished</span>
        </When>
      </header>

      <div className={styles.progressRow}>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }} />
        </div>
        <span className={styles.progressLabel}>
          {killedMonsters}/{totalKills}
        </span>
      </div>

      <div className={styles.rewardContainer}>
        <span className={styles.rewardLabel}>Reward</span>
        <div className={styles.rewardValue}>
          <img width={18} height={18} src="https://kidmortal.sirv.com/misc/soulshard.webp?w=20&h=20" />
          <span>{task.taskPoints} task points</span>
        </div>
      </div>
    </div>
  );
}
