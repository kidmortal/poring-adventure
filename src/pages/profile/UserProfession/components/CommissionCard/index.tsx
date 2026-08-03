import styles from './style.module.scss';

import { Button } from '@/components/shared/Button';
import { When } from '@/components/shared/When';
import { ItemChip } from '../ItemChip';

type Props = {
  commission: Commission;
  busy?: boolean;
  onDeliver: () => void;
};

/**
 * One standing NPC contract. Unlike a recipe or a node this costs no stamina —
 * the stamina was already spent making the goods. What it does is guarantee a
 * buyer, which is the point: it puts a floor under the price of everything a
 * crafter makes and, through the ingredients, under what a gatherer digs up.
 */
export function CommissionCard({ commission, busy, onDeliver }: Props) {
  const short = commission.amount - commission.owned;

  let blockedReason: string | undefined;
  if (commission.delivered) blockedReason = 'Filled today';
  else if (short > 0) blockedReason = `Need ${short} more`;

  return (
    <div className={`${styles.container} ${commission.delivered ? styles.done : ''}`}>
      <div className={styles.header}>
        <ItemChip item={commission.item} amount={commission.amount} />
        <div className={styles.reward}>
          <span className={styles.silver}>{commission.silver.toLocaleString()} silver</span>
          <span className={styles.experience}>+{commission.experience} exp</span>
        </div>
      </div>

      <div className={styles.progress}>
        <span className={commission.owned >= commission.amount ? styles.ready : styles.holding}>
          {Math.min(commission.owned, commission.amount)} / {commission.amount} in your bags
        </span>
        <When value={commission.requiredLevel > 1}>
          <span className={styles.level}>Lv {commission.requiredLevel}</span>
        </When>
      </div>

      <Button
        label={blockedReason ?? 'Deliver'}
        theme={blockedReason ? 'neutral' : 'primary'}
        disabled={!!blockedReason || busy}
        onClick={onDeliver}
      />
    </div>
  );
}
