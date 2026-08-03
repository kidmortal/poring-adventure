import cn from 'classnames';
import styles from './style.module.scss';

import { useModalStore } from '@/store/modal';

type Props = {
  item?: Item;
  /** How many of the item this chip stands for. */
  amount: number;
  /** Shown under the amount, e.g. how many the user owns or a drop chance. */
  note?: string;
  /** Renders the chip as unmet — used for ingredients the user is short on. */
  missing?: boolean;
};

/**
 * One item with an amount: a recipe ingredient, a result, a node drop or a
 * commission's order.
 *
 * Tapping it opens the catalogue entry. A recipe that asks for four of
 * something otherwise gives no way to find out what that something is or does,
 * and the name in a `title` is a dead end on a phone, where there is no hover
 * to fall back on.
 */
export function ItemChip({ item, amount, note, missing }: Props) {
  const modalStore = useModalStore();

  return (
    <button
      type="button"
      className={cn(styles.container, { [styles.missing]: missing })}
      title={item?.name}
      // Nothing to open for a chip whose item has not arrived yet.
      disabled={!item}
      onClick={() => item && modalStore.setItemInfo({ open: true, item })}
    >
      <img width={28} height={28} src={item?.image} alt={item?.name} />
      <span className={styles.amount}>x{amount}</span>
      {note && <span className={styles.note}>{note}</span>}
    </button>
  );
}
