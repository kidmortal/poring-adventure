import cn from 'classnames';
import styles from './style.module.scss';

import { BaseModal } from '../BaseModal';
import ForEach from '@/components/shared/ForEach';
import { When } from '@/components/shared/When';
import { Silver } from '@/components/StatsComponents/Silver';
import { useModalStore } from '@/store/modal';

type Props = {
  isOpen?: boolean;
  monster?: Monster;
  onRequestClose: () => void;
};

/** What a monster hits for, what it is worth, and everything it can drop. */
export function MonsterInfoModal({ isOpen, monster, onRequestClose }: Props) {
  const modalStore = useModalStore();

  // Best odds first: that is what decides whether a map is worth farming.
  const drops = [...(monster?.drops ?? [])].sort((a, b) => b.chance - a.chance);

  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <header className={styles.header}>
        <img className={styles.sprite} src={monster?.image} alt={monster?.name} />
        <div className={styles.identity}>
          <div className={styles.nameRow}>
            <h2 className={styles.name}>{monster?.name}</h2>
            <When value={!!monster?.boss}>
              <span className={styles.bossBadge}>boss</span>
            </When>
          </div>
          <span className={styles.level}>Lv {monster?.level}</span>
        </div>
      </header>

      <div className={styles.statRow}>
        <span className={styles.stat}>
          <span className={styles.statLabel}>HP</span>
          {monster?.health}
        </span>
        <span className={styles.stat}>
          <span className={styles.statLabel}>ATK</span>
          {monster?.attack}
        </span>
        <span className={styles.stat}>
          <span className={styles.statLabel}>EXP</span>
          {monster?.exp}
        </span>
        <Silver amount={monster?.silver} />
      </div>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Drops</span>
        <When value={drops.length === 0}>
          <span className={styles.empty}>Drops nothing at all</span>
        </When>
        <ForEach
          items={drops}
          render={(drop) => (
            // Opens the item in place of this modal — two stacked sheets would
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
