import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function guildService({ websocket }: { websocket?: Socket }) {
  async function getGuild() {
    if (!websocket) return undefined;
    return asyncEmit<Guild[]>(websocket, "get_guild", "");
  }
  async function getAllGuilds() {
    if (!websocket) return undefined;
    return asyncEmit<Guild[]>(websocket, "find_all_guild", "");
  }
  async function getGuildAvailableTasks() {
    if (!websocket) return undefined;
    return asyncEmit<GuildTask[]>(websocket, "get_available_guild_tasks", "");
  }

  return {
    getGuild,
    getGuildAvailableTasks,
    getAllGuilds,
  };
}
