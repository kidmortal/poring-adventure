import styles from './style.module.scss';
import ExperienceBar from '@/components/StatsComponents/ExperienceBar';

export function GuildInfo({ guild }: { guild?: Guild }) {
  return (
    <div className={styles.guildInfoContainer}>
      <img width={80} height={80} src={guild?.imageUrl} />
      <div className={styles.guildLevelContainer}>
        <h3>{guild?.name}</h3>
        <span>LVL: {guild?.level}</span>
        <ExperienceBar currentExp={guild?.experience} level={guild?.level} />
      </div>
      <div className={styles.guildResourcesContainer}>
        <span>Soulshard</span>
        <div className={styles.soulshardContainer}>
          <img src="https://kidmortal.sirv.com/misc/soulshard.webp?w=20&h=20" />
          <span>{guild?.taskPoints}</span>
        </div>
      </div>
    </div>
  );
}
