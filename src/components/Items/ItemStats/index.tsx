import { Utils } from '@/utils';
import { Stat } from '../../Character/CharacterStatsInfo';
import { When } from '../../shared/When';
import styles from './style.module.scss';

export function ItemStats({ inventoryItem }: { inventoryItem?: InventoryItem | InventoryItem }) {
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
      <h3>{`+${inventoryItem?.enhancement} ${inventoryItem?.item?.name}`}</h3>
      <span>{item?.category}</span>
      <When value={!!health}>
        <Stat assetName="health" label={`HP: ${health} +${Math.floor(health * multiplier)}`} />
      </When>
      <When value={!!mana}>
        <Stat assetName="mana" label={`MP: ${mana} +${Math.floor(mana * multiplier)}`} />
      </When>
      <When value={!!attack}>
        <Stat assetName="attack" label={`ATK: ${attack} +${Math.floor(attack * multiplier)}`} />
      </When>
      <When value={!!str}>
        <Stat assetName="str" label={`STR: ${str} +${Math.floor(str * multiplier)}`} />
      </When>
      <When value={!!agi}>
        <Stat assetName="agi" label={`AGI: ${agi} +${Math.floor(agi * multiplier)}`} />
      </When>
      <When value={!!int}>
        <Stat assetName="int" label={`INT: ${int} +${Math.floor(int * multiplier)}`} />
      </When>
    </div>
  );
}
