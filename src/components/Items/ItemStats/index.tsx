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
        {/* Gear is tiered, so the level it asks for belongs next to its name. */}
        <When value={(item?.requiredLevel ?? 1) > 1}>
          <span className={styles.requiredLevel}>Lv {item?.requiredLevel}</span>
        </When>
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
  const hasStats = !!(health || mana || attack || str || agi || int);

  return (
    <div className={styles.statsContainer}>
      <When value={showHeader}>
        <ItemIdentity inventoryItem={inventoryItem} />
      </When>
      {/* A meal has no stat block at all, and an empty list would still draw the
          divider the effect section hangs off. */}
      <When value={hasStats}>
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
      </When>

      <ConsumableEffect inventoryItem={inventoryItem} hasStats={hasStats} />
    </div>
  );
}

/**
 * What a consumable does beyond restoring vitals: the buff it grants, how long
 * that lasts at this stack's quality, and whether it can be used mid-fight.
 *
 * A meal's numbers are fixed by its recipe — a better cook makes one that lasts
 * longer, not one that hits harder — so quality shows up in the duration.
 */
function ConsumableEffect({
  inventoryItem,
  hasStats,
}: {
  inventoryItem?: InventoryItem;
  /** Whether anything is rendered above this, and so whether to draw a divider. */
  hasStats?: boolean;
}) {
  const item = inventoryItem?.item;
  const buff = item?.buff;
  if (!item || (!buff && !item.battleUse && !item.battleEffect)) return null;

  const quality = inventoryItem?.quality ?? 1;
  const duration = buff ? Math.max(1, Math.floor(buff.duration * Utils.qualityMultiplier(quality))) : 0;

  return (
    <div className={cn(styles.effectSection, { [styles.effectDivided]: hasStats })}>
      <When value={!!buff}>
        <div className={styles.effectRow}>
          <img width={20} height={20} src={buff?.image} alt={buff?.name} />
          <span className={styles.effectName}>{buff?.name}</span>
          <span className={styles.effectDuration}>{duration} battles</span>
        </div>
        <div className={styles.effectBonuses}>
          <When value={!!buff?.attackBonus}>
            <span>+{buff?.attackBonus}% attack</span>
          </When>
          <When value={!!buff?.healthBonus}>
            <span>-{buff?.healthBonus}% damage taken</span>
          </When>
        </div>
      </When>

      <When value={!!item.partyWide}>
        <span className={styles.effectNote}>Feeds your whole party</span>
      </When>
      <When value={item.battleEffect === 'escape'}>
        <span className={styles.effectNote}>Escapes a fight, whoever leads the party</span>
      </When>
      <When value={!!item.battleUse}>
        <span className={styles.effectNote}>Usable in battle — costs your turn</span>
      </When>
      <When value={!item.battleUse && !!buff}>
        <span className={styles.effectNote}>Eaten before a fight, not during one</span>
      </When>
    </div>
  );
}
