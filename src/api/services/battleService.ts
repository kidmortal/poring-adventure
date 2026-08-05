import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function battleService({ websocket }: { websocket?: Socket }) {
  async function getBattleInstance() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_update", "");
  }

  async function createBattleInstance(mapId: number) {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_create", { mapId });
  }

  /** Spends today's guild boss entry — for the whole party, when in one. */
  async function createGuildBossBattle() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_create_guild_boss", "");
  }

  /** `targetName` is the monster the player picked; omitted, the server chooses. */
  async function requestBattleAttack(params?: { targetName?: string }) {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_attack", params ?? {});
  }

  async function requestBattleCast(params: {
    skillId: number;
    targetName?: string;
  }) {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_cast", params);
  }

  /**
   * Drinks something mid-fight. It costs the turn, which is the trade against
   * bringing a Priest, and only items flagged `battleUse` are accepted — food
   * is eaten before a fight, not during one.
   */
  async function requestBattleUseItem(params: { inventoryId: number }) {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(websocket, "battle_use_item", params);
  }

  async function cancelBattleInstance() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_reset", "");
  }

  return {
    createBattleInstance,
    createGuildBossBattle,
    requestBattleAttack,
    requestBattleCast,
    requestBattleUseItem,
    cancelBattleInstance,
    getBattleInstance,
  };
}
