import { Utils } from '@/utils';
import { Stat } from '../../Character/CharacterStatsInfo';
import { When } from '../../shared/When';
import styles from './style.module.scss';
import { ITEM_QUALITY } from '@/constants';
import cn from 'classnames';

/** Item name coloured by quality, with the quality/category line under it. */
export function ItemIdentity({ inventoryItem }: { inventoryItem?: InventoryItem }) {
  const item = inventoryItem?.item;
  const enhancement = inventoryItem?.enhancement ?? 0;
  const qualityName = ITEM_QUALITY[inventoryItem?.quality ?? 0];

  return (
    <div className={styles.header}>
      <h3 className={cn(styles.itemName, styles[qualityName])}>{item?.name}</h3>
      <span className={styles.itemMeta}>
        {qualityName} · {item?.category}
        <When value={enhancement > 0}>
          <span className={styles.enhancementBadge}>+{enhancement}</span>
        </When>
      </span>
    </div>
  );
}

/**
 * Stat block for an item. `showHeader` renders the name/quality line — turn it
 * off when the surrounding screen already shows the item identity.
 */
export function ItemStats({
  inventoryItem,
  showHeader = true,
}: {
  inventoryItem?: InventoryItem | InventoryItem;
  showHeader?: boolean;
}) {
  const item = inventoryItem?.item;
  const enhancement = inventoryItem?.enhancement ?? 0;
  const quality = inventoryItem?.quality ?? 0;
  const multiplier = Utils.itemStatsMultiplier(quality, enhancement) - 1;
  const health = item?.health ?? 0;
  const mana = item?.mana ?? 0;
  const attack = item?.attack ?? 0;
  const str = item?.str ?? 0;
  const agi = item?.agi ?? 0;
  const int = item?.int ?? 0;

  return (
    <div className={styles.statsContainer}>
      <When value={showHeader}>
        <ItemIdentity inventoryItem={inventoryItem} />
      </When>
      <div className={styles.statList}>
        <When value={!!health}>
          <Stat assetName="health" label="HP" value={health} bonus={Math.floor(health * multiplier)} />
        </When>
        <When value={!!mana}>
          <Stat assetName="mana" label="MP" value={mana} bonus={Math.floor(mana * multiplier)} />
        </When>
        <When value={!!attack}>
          <Stat assetName="attack" label="ATK" value={attack} bonus={Math.floor(attack * multiplier)} />
        </When>
        <When value={!!str}>
          <Stat assetName="str" label="STR" value={str} bonus={Math.floor(str * multiplier)} />
        </When>
        <When value={!!agi}>
          <Stat assetName="agi" label="AGI" value={agi} bonus={Math.floor(agi * multiplier)} />
        </When>
        <When value={!!int}>
          <Stat assetName="int" label="INT" value={int} bonus={Math.floor(int * multiplier)} />
        </When>
      </div>
    </div>
  );
}
