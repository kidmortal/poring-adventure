import styles from './style.module.scss';
import { When } from '../shared/When';
import cn from 'classnames';

type Props = {
  guildTask?: CurrentGuildTask;
  finished?: boolean;
  onClick?: () => void;
};

export function GuildTaskInfo(props: Props) {
  const hasTask = !!props.guildTask;
  const taskTotalKils = props.guildTask?.task.killCount ?? 0;
  const remainingKills = props.guildTask?.remainingKills ?? 0;
  const killedMonsters = (remainingKills - taskTotalKils) * -1;
  return (
    <When value={hasTask}>
      <div
        onClick={props.onClick}
        className={cn(styles.guildTaskContainer, {
          [styles.completed]: props.finished,
        })}
      >
        <div className={styles.guildTaskDetails}>
          <div>
            {props.guildTask?.task?.name}
            <div>Map: {props.guildTask?.task.target.name}</div>
          </div>
          <div className={styles.taskMapContainer}>
            <img height={50} width={50} src={props.guildTask?.task.target.image} />
            <div className={styles.column}>
              <When value={props.finished ?? false}>
                <strong className={styles.completedLabel}>Finished</strong>
              </When>
              <span>
                {killedMonsters}/{taskTotalKils}
              </span>
            </div>
          </div>
        </div>
        <div className={styles.rewardContainer}>
          <span>Rewards:</span>
          <img src="https://kidmortal.sirv.com/misc/soulshard.webp?w=20&h=20" />
          <span>{props.guildTask?.task.taskPoints} Task points</span>
        </div>
      </div>
    </When>
  );
}
