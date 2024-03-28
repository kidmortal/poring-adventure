import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function notificationService({ websocket }: { websocket?: Socket }) {
  async function getAllNotifications() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "get_all_notification", "");
  }
  async function markAllAsViewed() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "view_all_notification", "");
  }

  async function claimAll() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "claim_all_notification", "");
  }

  return {
    getAllNotifications,
    markAllAsViewed,
    claimAll,
  };
}
