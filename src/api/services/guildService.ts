import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function guildService({ websocket }: { websocket?: Socket }) {
  async function getGuild() {
    if (!websocket) return undefined;
    return asyncEmit<Guild[]>(websocket, "get_guild", "");
  }
  async function finishGuildTask() {
    if (!websocket) return undefined;
    return asyncEmit<Guild[]>(websocket, "finish_current_task", "");
  }
  async function getAllGuilds() {
    if (!websocket) return undefined;
    return asyncEmit<Guild[]>(websocket, "find_all_guild", "");
  }
  async function getGuildAvailableTasks() {
    if (!websocket) return undefined;
    return asyncEmit<GuildTask[]>(websocket, "get_available_guild_tasks", "");
  }
  async function cancelCurrentTask() {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(websocket, "cancel_guild_task", "");
  }
  async function acceptGuildTask(args: { taskId: number }) {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(websocket, "accept_guild_task", args.taskId);
  }
  async function applyToGuild(args: { guildId: number }) {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(websocket, "apply_to_guild", args.guildId);
  }
  async function acceptGuildApplication(args: { applicationId: number }) {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(
      websocket,
      "accept_guild_application",
      args.applicationId
    );
  }

  async function refuseGuildApplication(args: { applicationId: number }) {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(
      websocket,
      "refuse_guild_application",
      args.applicationId
    );
  }

  return {
    getGuild,
    getGuildAvailableTasks,
    getAllGuilds,
    acceptGuildTask,
    cancelCurrentTask,
    finishGuildTask,
    applyToGuild,
    acceptGuildApplication,
    refuseGuildApplication,
  };
}
