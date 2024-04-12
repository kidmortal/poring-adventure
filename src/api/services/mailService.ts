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

  return {
    getAllMail,
    deleteAll,
    claimAll,
    viewAll,
  };
}
