import { Socket } from "socket.io-client";

import { MainStoreState } from "@/store/main";
import { ModalState } from "@/store/modal";
import { BattleState } from "@/store/battle";
import { WebsocketApi } from "@/api/websocketServer";

export function addWebsocketListeners({
  websocket,
  store,
  modal,
  battle,
  pushToScreen,
}: {
  websocket: Socket;
  api: WebsocketApi;
  store: MainStoreState;
  modal: ModalState;
  battle: BattleState;
  pushToScreen: (s: string) => void;
}) {
  websocket.on("market_update", (listings: MarketListing[]) =>
    store.setMarketListings(listings)
  );
  websocket.on("user_update", (user: User) => {
    console.log(user);
    store.setUserCharacterData(user);
  });
  websocket.on("party_data", (party: Party) => modal.setPartyInfo({ party }));
  websocket.on("party_data", (party: Party) => modal.setPartyInfo({ party }));
  websocket.on("mailbox", (mailBox: Mail[]) => store.setMailBox(mailBox));
  websocket.on("battle_update", (b: Battle) => {
    if (!window.location.pathname.includes("battle")) {
      pushToScreen("/battle");
    }
    console.log(b);
    battle.setBattle(b);
  });
}
