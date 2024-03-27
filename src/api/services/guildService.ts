import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function guildService({ websocket }: { websocket?: Socket }) {
  async function getAllGuilds() {
    if (!websocket) return undefined;
    return asyncEmit<Guild[]>(websocket, "find_all_guild", "");
  }

  return {
    getAllGuilds,
  };
}
