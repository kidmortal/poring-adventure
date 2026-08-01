import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function mailService({ websocket }: { websocket?: Socket }) {
  async function getAllMail() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "get_all_mail", "");
  }

  async function claimAll() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "claim_all_mail", "");
  }

  async function deleteAll() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "delete_all_mail", "");
  }

  async function viewAll() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "view_all_mail", "");
  }

  async function getAllNotifications(): Promise<GameNotification[] | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<GameNotification[]>(websocket, 'get_all_notifications', '');
  }

  async function readAllNotifications() {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(websocket, 'read_all_notifications', '');
  }

  async function deleteAllNotifications() {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(websocket, 'delete_all_notifications', '');
  }

  return {
    getAllMail,
    getAllNotifications,
    readAllNotifications,
    deleteAllNotifications,
    deleteAll,
    claimAll,
    viewAll,
  };
}
