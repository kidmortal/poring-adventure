import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function skillService({ websocket }: { websocket?: Socket }) {
  async function learnSkill(skillId: number) {
    if (!websocket) return undefined;

    return asyncEmit<string>(websocket, "learn_skill", skillId);
  }

  async function equipSkill(skillId: number) {
    if (!websocket) return undefined;
    return asyncEmit<string>(websocket, "equip_skill", skillId);
  }

  async function unequipSkill(skillId: number) {
    if (!websocket) return undefined;
    return asyncEmit<string>(websocket, "unequip_skill", skillId);
  }

  return {
    learnSkill,
    equipSkill,
    unequipSkill,
  };
}
