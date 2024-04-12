import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function adminService({ websocket }: { websocket?: Socket }) {
  async function getAllConnectedUsers() {
    if (!websocket) return undefined;

    return asyncEmit<User[]>(websocket, "get_all_connected_users", "");
  }

  async function clearCache() {
    if (!websocket) return undefined;
    return asyncEmit(websocket, "clear_all_cache", "");
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
    getAllConnectedUsers,
    clearCache,
    pushNotification,
    disconnectUser,
    sendGiftMail,
  };
}
