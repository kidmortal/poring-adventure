import styles from './style.module.scss';

import { BaseModal } from '../BaseModal';

import ForEach from '@/components/shared/ForEach';
import { When } from '@/components/shared/When';

import { buffEffectHint, buffLines, durationUnit } from '@/components/StatsComponents/BuffList/describe';

type Props = {
  isOpen?: boolean;
  buff?: UserBuff;
  onRequestClose: () => void;
};

/**
 * What a buff is actually worth, and how much of it is left.
 *
 * The character sheet has only ever shown the icon, so the two percentages a
 * meal grants — the entire reason to cook one — were invisible from the moment
 * it was eaten. This is where they live.
 */
export function BuffInfoModal(props: Props) {
  const held = props.buff;
  const buff = held?.buff;
  const lines = held ? buffLines(held) : [];
  const hint = buffEffectHint(buff?.effect);

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.container}>
        <header className={styles.header}>
          <img className={styles.icon} width={44} height={44} src={buff?.image} alt={buff?.name} />
          <div className={styles.identity}>
            <h3 className={styles.name}>{buff?.name}</h3>
            {/* Counted in fights for a meal and in turns for anything cast, and
                the two must never be confused — one is a night's supply, the
                other is a few seconds. */}
            <span className={styles.remaining}>
              {buff ? durationUnit(buff, held?.duration ?? 0) : ''} remaining
            </span>
          </div>
        </header>

        <When value={!!hint}>
          <p className={styles.hint}>{hint}</p>
        </When>

        <When value={lines.length > 0}>
          <section className={styles.statsSection}>
            <span className={styles.sectionTitle}>While it lasts</span>
            <ForEach
              items={lines}
              render={(line) => (
                <div key={line.label} className={styles.statRow}>
                  <span className={styles.statLabel}>{line.label}</span>
                  <span className={styles.statValue}>{line.value}</span>
                </div>
              )}
            />
          </section>
        </When>

        {/* A buff that grants no numbers is not broken — invincibility and
            second wind are rules, not percentages — so this says so rather than
            leaving an empty panel. */}
        <When value={lines.length === 0 && !hint}>
          <span className={styles.empty}>No stat changes — it only matters when it is needed.</span>
        </When>
      </div>
    </BaseModal>
  );
}
