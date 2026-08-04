import cn from 'classnames';

import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import ForEach from '@/components/shared/ForEach';
import { When } from '@/components/shared/When';
import { Silver } from '@/components/StatsComponents/Silver';
import { useModalStore } from '@/store/modal';

type Props = {
  isOpen?: boolean;
  monster?: DungeonMonster;
  /** How many bosses there are in all, so the last one can say it is the last. */
  totalStages?: number;
  onRequestClose: () => void;
};

/**
 * One boss on the path: what it hits for, what it is worth, and what it drops.
 *
 * The same report a map monster gets, with the stage in front of it — on a
 * dungeon the order matters, and knowing the third one is twice the second is
 * what tells a party whether to spend the day's entry here.
 */
export function DungeonBossModal({ isOpen, monster, totalStages, onRequestClose }: Props) {
  const modalStore = useModalStore();

  const isFinal = !!monster && !!totalStages && monster.stage === totalStages;
  // Best odds first: that is what decides whether the run is worth the entry.
  const drops = [...(monster?.drops ?? [])].sort((a, b) => b.chance - a.chance);

  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <header className={styles.header}>
        <img className={styles.sprite} src={monster?.image} alt={monster?.name} />
        <div className={styles.identity}>
          <div className={styles.nameRow}>
            <h2 className={styles.name}>{monster?.name}</h2>
            <span className={cn(styles.badge, { [styles.finalBadge]: isFinal })}>
              {isFinal ? 'final boss' : `boss ${monster?.stage}`}
            </span>
          </div>
          <span className={styles.level}>Lv {monster?.level}</span>
        </div>
      </header>

      <div className={styles.statRow}>
        <span className={styles.stat}>
          <span className={styles.statLabel}>HP</span>
          {monster?.health.toLocaleString()}
        </span>
        <span className={styles.stat}>
          <span className={styles.statLabel}>ATK</span>
          {monster?.attack}
        </span>
        <span className={styles.stat}>
          <span className={styles.statLabel}>DEF</span>
          {monster?.defense}
        </span>
      </div>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Paid on the kill</span>
        <div className={styles.rewardRow}>
          <Silver amount={monster?.silver} />
          <span className={styles.stat}>
            <span className={styles.statLabel}>EXP</span>
            {monster?.exp.toLocaleString()}
          </span>
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Drops</span>
        <When value={drops.length === 0}>
          <span className={styles.empty}>Drops nothing at all</span>
        </When>
        <ForEach
          items={drops}
          render={(drop) => (
            // Opens the item in place of this sheet — two stacked ones would
            // hide the thing you tapped.
            <button
              key={drop.id}
              type="button"
              className={styles.dropRow}
              onClick={() => {
                onRequestClose();
                modalStore.setItemInfo({ open: true, item: drop.item });
              }}
            >
              <img className={styles.dropImage} src={drop.item.image} alt={drop.item.name} />
              <div className={styles.dropText}>
                <span className={styles.dropName}>{drop.item.name}</span>
                <span className={styles.dropAmount}>
                  {drop.minAmount === drop.maxAmount ? `${drop.minAmount}x` : `${drop.minAmount}–${drop.maxAmount}x`}
                </span>
              </div>
              <span className={cn(styles.dropChance, { [styles.rareChance]: drop.chance < 20 })}>{drop.chance}%</span>
            </button>
          )}
        />
      </section>
    </BaseModal>
  );
}
