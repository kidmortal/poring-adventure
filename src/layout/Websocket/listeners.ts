import { Socket } from 'socket.io-client';

import { MainStoreState } from '@/store/main';
import { BattleState } from '@/store/battle';
import { WebsocketApi } from '@/api/websocketServer';
import { UserStoreState } from '@/store/user';

export function addWebsocketListeners({
  websocket,
  store,
  userStore,
  battle,
  pushToScreen,
}: {
  websocket: Socket;
  api: WebsocketApi;
  store: MainStoreState;
  userStore: UserStoreState;
  battle: BattleState;
  pushToScreen: (s: string) => void;
}) {
  websocket.on('market_update', (listings: MarketListing[]) => store.setMarketListings(listings));
  websocket.on('user_update', (user: User) => {
    console.log(user);
    userStore.setUser(user);
  });
  websocket.on('party_data', (party: Party) => userStore.setParty(party));
  websocket.on('party_status', (status: PartyStatus) => userStore.setPartyStatus(status));
  websocket.on('purchases', (purchases: UserPurchase[]) => {
    console.log(purchases);
    userStore.setPurchases(purchases);
  });
  websocket.on('mailbox', (mailBox: Mail[]) => userStore.setMailBox(mailBox));
  websocket.on('guild', (guild: Guild) => {
    console.log(guild);
    userStore.setGuild(guild);
  });
  websocket.on('battle_update', (b: Battle) => {
    if (!window.location.pathname.includes('battle')) {
      pushToScreen('/battle');
    }
    console.log(b);
    battle.setBattle(b);
  });
}
