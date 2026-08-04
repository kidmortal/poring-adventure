import { Socket } from 'socket.io-client';

import { MainStoreState } from '@/store/main';
import { BattleState, useBattleStore } from '@/store/battle';
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
  websocket.on('notifications', (n: GameNotification[]) => userStore.setNotifications(n));
  websocket.on('guild', (guild: Guild) => {
    console.log(guild);
    userStore.setGuild(guild);
  });
  // `false` is the server saying the guild has no boss standing.
  websocket.on('guild_boss', (boss: CurrentGuildBoss | false) => userStore.setGuildBoss(boss || undefined));
  websocket.on('dungeon_status', (status: DungeonStatus) => userStore.setDungeonStatus(status));
  websocket.on('battle_update', (b?: Battle) => {
    // The fight is over. A guild boss belongs to the guild screen — dropping the
    // player on the map selection instead reads as if they had gone hunting.
    if (!b) {
      const finished = useBattleStore.getState().battle;
      battle.setBattle(undefined);
      // A dungeon ends on the battle page, but on its own tab: a run that
      // failed leaves nothing standing for the page to work it out from.
      if (finished?.dungeon) {
        battle.setCameFromDungeon(true);
      }
      if (finished?.guildBoss && window.location.pathname.includes('battle')) {
        pushToScreen('/guild?tab=boss');
      }
      return;
    }
    if (!window.location.pathname.includes('battle')) {
      pushToScreen('/battle');
    }
    console.log(b);
    battle.setBattle(b);
  });
}
