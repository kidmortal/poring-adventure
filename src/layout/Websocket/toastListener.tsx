import { Socket } from 'socket.io-client';
import { MainStoreState } from '@/store/main';
import { BattleState } from '@/store/battle';
import { WebsocketApi } from '@/api/websocketServer';
import { InviteBox } from '@/components/InviteBox';
import { dismissToast, notify, notifyCustom } from '@/components/Toast/notify';

const PARTY_INVITE = 'party_invite';

export function addToastListeners({
  websocket,
  api,
}: {
  websocket: Socket;
  api: WebsocketApi;
  store: MainStoreState;
  battle: BattleState;
  pushToScreen: (s: string) => void;
}) {
  websocket.on('party_invite', (party: Party) => {
    notifyCustom(
      PARTY_INVITE,
      <InviteBox
        party={party}
        // Dismissed by id: the object form is react-toastify v11's, and on the
        // v10 we run it matched nothing, so refusing left the invite on screen.
        onRefuse={() => dismissToast(PARTY_INVITE)}
        onConfirm={() => {
          dismissToast(PARTY_INVITE);
          if (party.id) {
            api.party.joinParty({ partyId: party.id });
          }
        }}
      />,
      { type: 'info' },
    );
  });

  websocket.on('notification', (msg: string) => notify(msg));
  websocket.on('error_notification', (msg: string) => notify(msg, { type: 'error' }));
}
