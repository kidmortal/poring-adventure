import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";

import { useEffect } from "react";
import { useMainStore } from "@/store/main";

export function WebsocketLayout() {
  const store = useMainStore();

  useEffect(() => {
    if (!store.websocket && store.loggedUserInfo.accessToken) {
      store.setWebsocket(
        io("http://localhost:8000", {
          auth: { acessToken: store.loggedUserInfo.accessToken },
        })
      );
    }
  }, [store.loggedUserInfo.accessToken]);

  useEffect(() => {
    if (store.websocket) {
      store.websocket.on("message", (msg: string) => {
        console.log(msg); // true
      });
    }
  }, [store.websocket]);

  return <Outlet />;
}
