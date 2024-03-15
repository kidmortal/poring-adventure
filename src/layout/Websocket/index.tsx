import { Outlet, useNavigate } from "react-router-dom";
import { Socket, io } from "socket.io-client";

import { useEffect, useState } from "react";
import { useMainStore } from "@/store/main";

import { useBattleStore } from "@/store/battle";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { useModalStore } from "@/store/modal";
import { useWebsocketApi } from "@/api/websocketServer";
import { addToastListeners } from "@/toast";

export function WebsocketLayout() {
  const [temporarySocket, setTemporarySocket] = useState<Socket | undefined>();
  const store = useMainStore();
  const modal = useModalStore();
  const battleStore = useBattleStore();
  const api = useWebsocketApi();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      store.loggedUserInfo.accessToken &&
      !temporarySocket &&
      !store.websocket
    ) {
      const socket = io(import.meta.env.VITE_API_URL, {
        auth: { acessToken: store.loggedUserInfo.accessToken },
      });

      socket.on("authenticated", () => store.setWsAuthenticated(true));

      setTemporarySocket(socket);
      socket.on("connect", () => store.setWebsocket(socket));
    }
  }, [store.loggedUserInfo.accessToken]);

  useEffect(() => {
    if (store.websocket) {
      addToastListeners({
        websocket: store.websocket,
        api,
        modal,
        battle: battleStore,
        store,
        pushToScreen: (s) => navigate(s),
      });
    }
  }, [store.websocket]);

  if (!store.websocket && !store.wsAuthenticated) {
    return <FullscreenLoading info="Websocket connection" />;
  }

  return <Outlet />;
}
