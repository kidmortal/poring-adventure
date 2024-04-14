import { Socket } from "socket.io-client";

import { AdminStoreState } from "@/store/admin";
import { ServerInfo } from "@/api/services/adminService";

export function addAdminWebsocketListeners({
  websocket,
  store,
}: {
  websocket: Socket;
  store: AdminStoreState;
}) {
  websocket.on(
    "connected_users",
    (sockets: { users: User[]; connectedSockets: number }) => {
      store.setConnectedUsers(sockets.users);
      store.setConnectedSockets(sockets.connectedSockets);
    }
  );
  websocket.on("server_info", (server: ServerInfo) => {
    store.setServerInfo(server);
  });
}
