import { Outlet } from "react-router-dom";
import { io } from "socket.io-client";

import { useEffect } from "react";
import { useMainStore } from "@/store/main";
import { toast } from "react-toastify";

import { useBattleStore } from "@/store/battle";

export function WebsocketLayout() {
  const store = useMainStore();
  const battleStore = useBattleStore();

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
      store.websocket.on("battle_update", (battle: Battle) => {
        console.log("receiving battle update");
        console.log(battle);
        battleStore.setBattle(battle);
      });
    }
  }, [store.websocket]);

  return <Outlet />;
}
