import { Tooltip } from "../Tooltip";
import styles from "./style.module.scss";
import cn from "classnames";

type Props = {
  equip: Equipment;
  backgroundColor?: string;
  onClick?: () => void;
};

function EquipmentStat({ equip }: { equip: Equipment }) {
  return (
    <div className={styles.statsContainer}>
      <h3>{equip?.item?.name}</h3>
      <span>{equip.item.category}</span>
      <div className={styles.statContainer}>
        <img src="assets/stats/health.webp" />
        <span>HP: {equip?.item?.health}</span>
      </div>
      <div className={styles.statContainer}>
        <img src="assets/stats/attack.webp" />
        <span>ATK: {equip?.item?.attack}</span>
      </div>
    </div>
  );
}

export function EquippedItem(args: Props) {
  const equipment = args?.equip;
  const item = equipment?.item;

  if (!equipment) {
    return <div className={cn(styles.inventoryItemContainer, styles.empty)} />;
  }

  if (!item) {
    return <div className={cn(styles.inventoryItemContainer, styles.empty)} />;
  }

  return (
    <Tooltip direction="right" text={<EquipmentStat equip={equipment} />}>
      <div
        onClick={args.onClick}
        style={{ backgroundColor: args.backgroundColor }}
        className={cn(styles.inventoryItemContainer)}
      >
        <img width={40} height={40} src={item?.image} />
      </div>
    </Tooltip>
  );
}
