import styles from './style.module.scss';
import { Button } from '@/components/shared/Button';
import { useModalStore } from '@/store/modal';

const BLESSING_STATS = [
  { assetName: 'health', label: 'HP', key: 'health' },
  { assetName: 'mana', label: 'MP', key: 'mana' },
  { assetName: 'str', label: 'STR', key: 'str' },
  { assetName: 'agi', label: 'AGI', key: 'agi' },
  { assetName: 'int', label: 'INT', key: 'int' },
] as const;

/**
 * Blessings buff every member, but the values were only visible inside the
 * upgrade modal — this shows what the guild currently grants.
 */
export function GuildBlessings({ blessing }: { blessing?: GuildBlessing }) {
  const modalStore = useModalStore();

  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Blessings</span>
        <Button
          label="Upgrade"
          theme="neutral"
          className={styles.upgradeButton}
          onClick={() => modalStore.setGuildBlessing({ open: true })}
        />
      </div>

      {blessing ? (
        <div className={styles.statGrid}>
          {BLESSING_STATS.map((stat) => (
            <div key={stat.key} className={styles.statChip}>
              <img src={`https://kidmortal.sirv.com/misc/${stat.assetName}.webp`} alt={stat.label} />
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>+{blessing[stat.key]}</span>
            </div>
          ))}
        </div>
      ) : (
        <span className={styles.empty}>No blessings unlocked yet.</span>
      )}
    </section>
  );
}
