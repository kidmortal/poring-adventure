import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function itemService({ websocket }: { websocket?: Socket }) {
  async function consumeItem(itemId: number) {
    if (!websocket) return undefined;

    return asyncEmit<string>(websocket, "consume_item", itemId);
  }

  async function equipItem(itemId: number) {
    if (!websocket) return undefined;
    return asyncEmit<string>(websocket, "equip_item", itemId);
  }

  async function unequipItem(itemId: number) {
    if (!websocket) return undefined;
    return asyncEmit<string>(websocket, "unequip_item", itemId);
  }

  return {
    consumeItem,
    equipItem,
    unequipItem,
  };
}
