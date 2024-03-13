import { Socket } from "socket.io-client";
import { WebsocketApi } from "../api/websocketServer";
import { toast } from "react-toastify";
import { MainStoreState } from "@/store/main";
import { ModalState } from "@/store/modal";
import { BattleState } from "@/store/battle";
import { InviteBox } from "./InviteBox";

export function addToastListeners({
  websocket,
  api,
  store,
  modal,
  battle,
}: {
  websocket: Socket;
  api: WebsocketApi;
  store: MainStoreState;
  modal: ModalState;
  battle: BattleState;
}) {
  websocket.on("party_invite", (party: Party) => {
    toast(
      <InviteBox
        party={party}
        onRefuse={() => {
          toast.dismiss({ id: "party_invite", containerId: "" });
        }}
        onConfirm={() => {
          toast.dismiss({ id: "party_invite", containerId: "" });
          if (party.id) {
            api.party.joinParty(party.id);
          }
        }}
      />,
      {
        autoClose: false,
        toastId: "party_invite",
        type: "info",
        theme: "colored",
      }
    );
  });

  websocket.on("market_update", (listings: MarketListing[]) =>
    store.setMarketListings(listings)
  );
  websocket.on("user_update", (user: User) => store.setUserCharacterData(user));
  websocket.on("party_data", (party: Party) => modal.setPartyInfo({ party }));
  websocket.on("battle_update", (b: Battle) => {
    console.log(b);
    battle.setBattle(b);
  });
  websocket.on("notification", (msg: string) => {
    toast(msg, { type: "info", autoClose: 5000 });
  });
}
