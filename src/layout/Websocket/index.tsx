import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";

import { useEffect } from "react";
import { useMainStore } from "@/store/main";
import { toast } from "react-toastify";

export function WebsocketLayout() {
  const store = useMainStore();

  useEffect(() => {
    if (!store.websocket && store.loggedUserInfo.accessToken) {
      store.setWebsocket(
        io(import.meta.env.VITE_API_URL, {
          auth: { acessToken: store.loggedUserInfo.accessToken },
        })
      );
    }
  }, [store.loggedUserInfo.accessToken]);

  useEffect(() => {
    if (store.websocket) {
      store.websocket.on("notification", (msg: string) => {
        toast(msg, { type: "info", autoClose: 2000 });
      });
    }
  }, [store.websocket]);

  return <Outlet />;
}
