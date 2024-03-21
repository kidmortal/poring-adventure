import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function monsterService({ websocket }: { websocket?: Socket }) {
  async function getAllMaps() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "get_maps", "");
  }

  return {
    getAllMaps,
  };
}
