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

  /** Sends silver and/or an item to another player as mail. No tax. */
  async function sendGift(dto: SendGiftDto): Promise<boolean | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(websocket, 'send_gift', dto);
  }

  return {
    getAllMail,
    sendGift,
    getAllNotifications,
    readAllNotifications,
    deleteAllNotifications,
    deleteAll,
    claimAll,
    viewAll,
  };
}
