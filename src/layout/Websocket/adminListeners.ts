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
  websocket.on("connected_users", (users: User[]) =>
    store.setConnectedUsers(users)
  );
  websocket.on("server_info", (server: ServerInfo) =>
    store.setServerInfo(server)
  );
}
