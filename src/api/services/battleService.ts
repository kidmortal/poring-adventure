import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function battleService({ websocket }: { websocket?: Socket }) {
  async function getBattleInstance() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_update", "");
  }

  async function createBattleInstance(mapId: number) {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_create", mapId);
  }

  async function requestBattleAttack() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_attack", "");
  }

  async function requestBattleCast(params: {
    skillId: number;
    targetName?: string;
  }) {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_cast", params);
  }

  async function cancelBattleInstance() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_reset", "");
  }

  return {
    createBattleInstance,
    requestBattleAttack,
    requestBattleCast,
    cancelBattleInstance,
    getBattleInstance,
  };
}
