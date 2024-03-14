import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function adminService({ websocket }: { websocket?: Socket }) {
  async function getAllWebsockets() {
    if (!websocket) return undefined;

    return asyncEmit<{ id: string; email: string }[]>(
      websocket,
      "get_all_sockets",
      ""
    );
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
    getAllWebsockets,
  };
}
