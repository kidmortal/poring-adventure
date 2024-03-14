import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function battleService({ websocket }: { websocket?: Socket }) {
  async function getBattleInstance() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_update", "");
  }

  async function createBattleInstance() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_create", "");
  }

  async function requestBattleAttack() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_attack", "");
  }

  async function requestBattleCast(skillId: number) {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_cast", skillId);
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
