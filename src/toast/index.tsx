import { Socket } from "socket.io-client";
import { WebsocketApi } from "../api/websocketServer";
import { toast } from "react-toastify";
import { Button } from "../components/Button";
import { MainStoreState } from "@/store/main";
import { ModalState } from "@/store/modal";
import { BattleState } from "@/store/battle";

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
      <div>
        Part invite ID: {party.id}
        <Button
          label="Accept invite"
          onClick={() => {
            toast.dismiss({ id: "party_invite", containerId: "" });

            if (party.id) {
              api.party.joinParty(party.id);
            }
          }}
        />
        <Button
          label="Refuse invite"
          onClick={() => {
            toast.dismiss({ id: "party_invite", containerId: "" });
          }}
        />
      </div>,
      {
        autoClose: false,
        toastId: "party_invite",
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
