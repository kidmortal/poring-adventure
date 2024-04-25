import { Socket } from 'socket.io-client';
import { asyncEmit } from '../websocketServer';

export function itemService({ websocket }: { websocket?: Socket }) {
  async function consumeItem(dto: ConsumeItemDto) {
    if (!websocket) return undefined;
    return asyncEmit<string>(websocket, 'consume_item', dto);
  }

  async function equipItem(dto: EquipItemDto) {
    if (!websocket) return undefined;
    return asyncEmit<string>(websocket, 'equip_item', dto);
  }

  async function unequipItem(dto: UnequipItemDto) {
    if (!websocket) return undefined;
    return asyncEmit<string>(websocket, 'unequip_item', dto);
  }

  async function enhanceItem(dto: EnhanceItemDto): Promise<boolean | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(websocket, 'enhance_item', dto);
  }

  async function upgradeItem(dto: UpgradeItemDto) {
    if (!websocket) return undefined;
    return asyncEmit<string>(websocket, 'upgrade_item', dto);
  }

  return {
    consumeItem,
    equipItem,
    unequipItem,
    enhanceItem,
    upgradeItem,
  };
}
