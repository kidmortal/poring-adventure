import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function dungeonService({ websocket }: { websocket?: Socket }) {
  async function getAllDungeons() {
    if (!websocket) return undefined;
    return asyncEmit<Dungeon[]>(websocket, "get_dungeons", "");
  }

  /**
   * The run the player is inside plus every entry their party holds. Both are
   * party-wide, because walking in spends the entry of everyone in the party.
   */
  async function getDungeonStatus() {
    if (!websocket) return undefined;
    return asyncEmit<DungeonStatus>(websocket, "get_dungeon_status", "");
  }

  /** Spends today's entry — for the whole party, when in one. */
  async function enterDungeon(dungeonId: number) {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(websocket, "battle_create_dungeon", { dungeonId });
  }

  /** Opens the next boss. No entry is spent; the party's health carries over. */
  async function continueDungeon() {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(websocket, "battle_dungeon_continue", "");
  }

  /** Walking out between bosses. It costs the run, and the run is the entry. */
  async function abandonDungeon() {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(websocket, "dungeon_abandon", "");
  }

  return {
    getAllDungeons,
    getDungeonStatus,
    enterDungeon,
    continueDungeon,
    abandonDungeon,
  };
}
