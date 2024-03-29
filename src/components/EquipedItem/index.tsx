import { Stat } from "../CharacterStatsInfo";
import { When } from "../When";
import styles from "./style.module.scss";
import cn from "classnames";

type Props = {
  equip?: Equipment;
  backgroundColor?: string;
  onClick?: () => void;
};

export function ItemStats({ item }: { item?: Equipment | InventoryItem }) {
  return (
    <div className={styles.statsContainer}>
      <h3>{item?.item?.name}</h3>
      <span>{item?.item.category}</span>
      <When value={!!item?.item?.health}>
        <Stat assetName="health" label={`HP: ${item?.item?.health}`} />
      </When>
      <When value={!!item?.item?.mana}>
        <Stat assetName="mana" label={`MP: ${item?.item?.mana}`} />
      </When>
      <When value={!!item?.item?.attack}>
        <Stat assetName="attack" label={`ATK: ${item?.item?.attack}`} />
      </When>
      <When value={!!item?.item?.str}>
        <Stat assetName="str" label={`STR: ${item?.item?.str}`} />
      </When>
      <When value={!!item?.item?.agi}>
        <Stat assetName="agi" label={`AGI: ${item?.item?.agi}`} />
      </When>
      <When value={!!item?.item?.int}>
        <Stat assetName="int" label={`INT: ${item?.item?.int}`} />
      </When>
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
    <div
      onClick={args.onClick}
      style={{ backgroundColor: args.backgroundColor }}
      className={cn(styles.inventoryItemContainer)}
    >
      <img width={40} height={40} src={item?.image} />
    </div>
  );
}
