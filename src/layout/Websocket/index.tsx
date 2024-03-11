import { Outlet } from "react-router-dom";
import { Socket, io } from "socket.io-client";

import { useEffect, useState } from "react";
import { useMainStore } from "@/store/main";
import { toast } from "react-toastify";

import { useBattleStore } from "@/store/battle";
import { FullscreenLoading } from "@/components/FullscreenLoading";

export function WebsocketLayout() {
  const [temporarySocket, setTemporarySocket] = useState<Socket | undefined>();
  const store = useMainStore();
  const battleStore = useBattleStore();

  useEffect(() => {
    if (
      store.loggedUserInfo.accessToken &&
      !temporarySocket &&
      !store.websocket
    ) {
      const socket = io(import.meta.env.VITE_API_URL, {
        auth: { acessToken: store.loggedUserInfo.accessToken },
      });
      socket.on("notification", (msg: string) => {
        toast(msg, { type: "info", autoClose: 5000 });
      });
      socket.on("authenticated", () => store.setWsAuthenticated(true));
      socket.on("market_listing", (listings: MarketListing[]) =>
        store.setMarketListings(listings)
      );
      socket.on("battle_update", (battle: Battle) =>
        battleStore.setBattle(battle)
      );
      setTemporarySocket(socket);
      socket.on("connect", () => store.setWebsocket(socket));
    }
  }, [store.loggedUserInfo.accessToken]);

  if (!store.websocket && !store.wsAuthenticated) {
    return <FullscreenLoading info="Websocket connection" />;
  }

  return <Outlet />;
}
