import styles from './style.module.scss';
import { Button } from '@/components/shared/Button';
import { useModalStore } from '@/store/modal';
import { BLESSINGS, blessingLevel } from '@/modals/GuildBlessingModal/blessings';

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
          {BLESSINGS.map((stat) => (
            <div
              key={stat.alias}
              className={styles.statChip}
              title={`${stat.name} — level ${blessingLevel(blessing[stat.alias] ?? 0, stat.multiplier)}`}
            >
              <img src={`https://kidmortal.sirv.com/misc/${stat.src}.webp`} alt={stat.label} />
              <span className={styles.statLabel}>{stat.label}</span>
              <span className={styles.statValue}>+{blessing[stat.alias] ?? 0}</span>
            </div>
          ))}
        </div>
      ) : (
        <span className={styles.empty}>No blessings unlocked yet.</span>
      )}
    </section>
  );
}
