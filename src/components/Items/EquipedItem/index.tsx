import { Stat } from '../../Character/CharacterStatsInfo';
import { When } from '../../shared/When';
import styles from './style.module.scss';
import cn from 'classnames';

type Props = {
  inventoryItem?: InventoryItem;
  backgroundColor?: string;
  onClick?: () => void;
};

export function ItemStats({ inventoryItem }: { inventoryItem?: InventoryItem | InventoryItem }) {
  return (
    <div className={styles.statsContainer}>
      <h3>{`+${inventoryItem?.enhancement} ${inventoryItem?.item?.name}`}</h3>
      <span>{inventoryItem?.item.category}</span>
      <When value={!!inventoryItem?.item?.health}>
        <Stat assetName="health" label={`HP: ${inventoryItem?.item?.health}`} />
      </When>
      <When value={!!inventoryItem?.item?.mana}>
        <Stat assetName="mana" label={`MP: ${inventoryItem?.item?.mana}`} />
      </When>
      <When value={!!inventoryItem?.item?.attack}>
        <Stat assetName="attack" label={`ATK: ${inventoryItem?.item?.attack}`} />
      </When>
      <When value={!!inventoryItem?.item?.str}>
        <Stat assetName="str" label={`STR: ${inventoryItem?.item?.str}`} />
      </When>
      <When value={!!inventoryItem?.item?.agi}>
        <Stat assetName="agi" label={`AGI: ${inventoryItem?.item?.agi}`} />
      </When>
      <When value={!!inventoryItem?.item?.int}>
        <Stat assetName="int" label={`INT: ${inventoryItem?.item?.int}`} />
      </When>
    </div>
  );
}

export function EquippedItem(args: Props) {
  const equipment = args?.inventoryItem;
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
