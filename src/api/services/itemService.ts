import { Socket } from 'socket.io-client';
import { asyncEmit } from '../websocketServer';

export function itemService({ websocket }: { websocket?: Socket }) {
  /**
   * Resolves to what the consumable actually did — how much it restored once
   * quality was applied, and the buff it granted if it was a meal.
   */
  async function consumeItem(dto: ConsumeItemDto): Promise<ConsumeResult | false | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<ConsumeResult | false>(websocket, 'consume_item', dto);
  }

  async function equipItem(dto: EquipItemDto) {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(websocket, 'equip_item', dto);
  }

  async function unequipItem(dto: UnequipItemDto) {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(websocket, 'unequip_item', dto);
  }

  /** Resolves to the roll's outcome, or false when the attempt was refused. */
  async function enhanceItem(dto: EnhanceItemDto): Promise<EnhanceResult | false | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<EnhanceResult | false>(websocket, 'enhance_item', dto);
  }

  /**
   * Feeds a duplicate in for a chance at the next rarity. Resolves to the roll's
   * outcome, or false when the attempt was refused.
   */
  async function upgradeItem(dto: UpgradeItemDto): Promise<UpgradeResult | false | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<UpgradeResult | false>(websocket, 'upgrade_item', dto);
  }

  return {
    consumeItem,
    equipItem,
    unequipItem,
    enhanceItem,
    upgradeItem,
  };
}
