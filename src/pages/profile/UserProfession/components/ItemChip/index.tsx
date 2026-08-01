import cn from 'classnames';
import styles from './style.module.scss';

type Props = {
  item?: Item;
  /** How many of the item this chip stands for. */
  amount: number;
  /** Shown under the amount, e.g. how many the user owns or a drop chance. */
  note?: string;
  /** Renders the chip as unmet — used for ingredients the user is short on. */
  missing?: boolean;
};

/** One item with an amount: a recipe ingredient, a result, or a node drop. */
export function ItemChip({ item, amount, note, missing }: Props) {
  return (
    <div className={cn(styles.container, { [styles.missing]: missing })} title={item?.name}>
      <img width={28} height={28} src={item?.image} alt={item?.name} />
      <span className={styles.amount}>x{amount}</span>
      {note && <span className={styles.note}>{note}</span>}
    </div>
  );
}
