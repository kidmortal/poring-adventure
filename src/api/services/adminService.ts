import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

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

  async function pushNotificationToUser(args: {
    email: string;
    message: string;
  }) {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "send_push_notification_user", args);
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
  };
}
