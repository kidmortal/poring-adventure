import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";
import { BattleDebugAction } from "@/components/WebsocketDebugPanel/battleActions";

export type ServerInfo = {
  branchHash: string;
  memoryInfo: MemoryInfo;
};

type MemoryInfo = {
  totalMemory: number;
  appMemoryUsage: number;
  totalMemoryUsage: number;
};

export function adminService({ websocket }: { websocket?: Socket }) {
  async function getAllConnectedUsers() {
    if (!websocket) return undefined;

    return asyncEmit<User[]>(websocket, "get_all_connected_users", "");
  }

  async function clearCache() {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "clear_all_cache", "");
  }

  async function restartServer() {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "restart_server", "");
  }

  async function pushNotification(args: { message: string }) {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "send_push_notification", args.message);
  }

  async function disconnectUser(args: { email: string }) {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "disconnect_user_websocket", args.email);
  }

  async function sendGiftMail(args: { email: string }) {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "send_gift_mail", args.email);
  }
  async function fullHealUser(args: { email: string }) {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "full_heal_user", args.email);
  }
  async function killUser(args: { email: string }) {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "kill_user", args.email);
  }

  async function pushNotificationToUser(args: {
    email: string;
    message: string;
  }) {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "send_push_notification_user", args);
  }

  /** No email resets every character; an email resets just that one. */
  async function resetDailyStamina(args?: { email?: string }) {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "reset_daily_stamina", args?.email ?? "");
  }

  async function resetBossEntry(args?: { email?: string }) {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "reset_boss_entry", args?.email ?? "");
  }

  async function clearGuildBosses() {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "clear_guild_bosses", "");
  }

  async function giveSilver(args: { email: string; amount: number }) {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "give_silver", args);
  }

  async function forceEndBattle(args: { email: string }) {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "force_end_battle", args.email);
  }

  /** No email kills the monsters in your own fight. */
  async function killBattleMonsters(args?: { email?: string }) {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "kill_battle_monsters", args?.email ?? "");
  }

  /**
   * Every battle debug action goes through one event, with the verb in the
   * payload. No email means your own fight.
   */
  async function battleDebugAction(args: {
    action: BattleDebugAction;
    email?: string;
    name?: string;
    amount?: number;
  }) {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "battle_debug_action", args);
  }

  /** No email repairs every character. */
  async function resyncLevels(args?: { email?: string }) {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "resync_levels", args?.email ?? "");
  }

  async function clearUserCache(args: { email: string }) {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "clear_user_cache", args.email);
  }

  async function getServerInfo() {
    if (!websocket) return undefined;
    return asyncEmit<ServerInfo>(websocket, "get_server_info", "");
  }

  async function sendWebsocketNotification(args: {
    to: string;
    message: string;
  }) {
    if (!websocket) return undefined;

    return asyncEmit<{ id: string; email: string }[]>(
      websocket,
      "message_socket",
      args
    );
  }

  return {
    sendWebsocketNotification,
    pushNotificationToUser,
    restartServer,
    getAllConnectedUsers,
    clearCache,
    getServerInfo,
    pushNotification,
    disconnectUser,
    sendGiftMail,
    fullHealUser,
    killUser,
    resetDailyStamina,
    resetBossEntry,
    clearGuildBosses,
    giveSilver,
    forceEndBattle,
    killBattleMonsters,
    battleDebugAction,
    resyncLevels,
    clearUserCache,
  };
}
