import { Socket } from 'socket.io-client';
import { asyncEmit } from '../websocketServer';

export function guildService({ websocket }: { websocket?: Socket }) {
  async function getGuild() {
    if (!websocket) return undefined;
    return asyncEmit<Guild[]>(websocket, 'get_guild', '');
  }

  async function getAllGuilds() {
    if (!websocket) return undefined;
    return asyncEmit<Guild[]>(websocket, 'find_all_guild', '');
  }

  async function getGuildAvailableTasks() {
    if (!websocket) return undefined;
    return asyncEmit<GuildTask[]>(websocket, 'get_available_guild_tasks', '');
  }

  async function applyToGuild(dto: ApplyToGuildDto) {
    if (!websocket) return undefined;
    return asyncEmit<void>(websocket, 'apply_to_guild', dto);
  }

  async function kickFromGuild(dto: KickFromGuildDto) {
    if (!websocket) return undefined;
    return asyncEmit<void>(websocket, 'kick_from_guild', dto);
  }

  async function quitFromGuild() {
    if (!websocket) return undefined;
    return asyncEmit<void>(websocket, 'quit_from_guild', '');
  }

  async function acceptGuildApplication(dto: AcceptGuildApplicationDto) {
    if (!websocket) return undefined;
    return asyncEmit<void>(websocket, 'accept_guild_application', dto);
  }

  async function refuseGuildApplication(dto: RefuseGuildApplicationDto) {
    if (!websocket) return undefined;
    return asyncEmit<void>(websocket, 'refuse_guild_application', dto);
  }

  async function finishQuest() {
    if (!websocket) return undefined;
    return asyncEmit<void>(websocket, 'finish_current_task', '');
  }

  async function acceptGuildTask(dto: AcceptGuildTaskDto) {
    if (!websocket) return undefined;
    return asyncEmit<void>(websocket, 'accept_guild_task', dto);
  }

  async function cancelGuildTask(dto: CancelGuildTaskDto) {
    if (!websocket) return undefined;
    return asyncEmit<void>(websocket, 'cancel_guild_task', dto);
  }

  async function unlockBlessing(dto: UnlockBlessingsDto) {
    if (!websocket) return undefined;
    return asyncEmit<void>(websocket, 'unlock_blessing', dto);
  }

  async function upgradeBlessing(dto: UpgradeBlessingsDto) {
    if (!websocket) return undefined;
    return asyncEmit<void>(websocket, 'upgrade_blessing', dto);
  }

  return {
    getGuild,
    getAllGuilds,
    getGuildAvailableTasks,
    applyToGuild,
    kickFromGuild,
    quitFromGuild,
    acceptGuildApplication,
    refuseGuildApplication,
    finishQuest,
    acceptGuildTask,
    cancelGuildTask,
    unlockBlessing,
    upgradeBlessing,
  };
}
