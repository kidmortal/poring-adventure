import { Socket } from "socket.io-client";
import { toast } from "react-toastify";
import { MainStoreState } from "@/store/main";
import { ModalState } from "@/store/modal";
import { BattleState } from "@/store/battle";
import { WebsocketApi } from "@/api/websocketServer";
import { InviteBox } from "@/components/InviteBox";

export function addToastListeners({
  websocket,
  api,
}: {
  websocket: Socket;
  api: WebsocketApi;
  store: MainStoreState;
  modal: ModalState;
  battle: BattleState;
  pushToScreen: (s: string) => void;
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

  websocket.on("notification", (msg: string) => {
    toast(msg, { type: "info", autoClose: 3000, theme: "colored" });
  });
  websocket.on("error_notification", (msg: string) => {
    toast(msg, { type: "error", autoClose: 3000, theme: "colored" });
  });
}
