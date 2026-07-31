import styles from './style.module.scss';
import ExperienceBar from '@/components/StatsComponents/ExperienceBar';

export function GuildInfo({ guild }: { guild?: Guild }) {
  return (
    <div className={styles.guildInfoContainer}>
      <img className={styles.emblem} src={guild?.imageUrl} alt={guild?.name} />

      <div className={styles.guildLevelContainer}>
        <div className={styles.nameRow}>
          <h3 className={styles.guildName}>{guild?.name}</h3>
          <span className={styles.levelBadge}>Lv {guild?.level}</span>
        </div>
        <ExperienceBar currentExp={guild?.experience} level={guild?.level} />
      </div>

      <div className={styles.soulshardContainer} title="Soulshards">
        <img width={18} height={18} src="https://kidmortal.sirv.com/misc/soulshard.webp?w=20&h=20" />
        <span>{guild?.taskPoints ?? 0}</span>
      </div>
    </div>
  );
}
