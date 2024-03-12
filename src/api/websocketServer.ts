import { useMainStore } from "@/store/main";
import { Socket } from "socket.io-client";

async function asyncEmit<T>(
  ws: Socket,
  event: string,
  args: number | string | object
): Promise<T> {
  return new Promise(function (resolve) {
    ws.emit(event, args, (response: T) => {
      resolve(response);
    });
  });
}

export function useWebsocketApi() {
  const { websocket } = useMainStore();

  async function createMarketListing(args: {
    price: number;
    stack: number;
    itemId: number;
  }) {
    if (!websocket) return undefined;
    return new Promise(function (resolve) {
      websocket.emit("create_market_listing", args, (msg: string) => {
        resolve(msg);
      });
    });
  }

  async function getBattleInstance() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_update", "");
  }

  async function createBattleInstance() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_create", "");
  }

  async function requestBattleAttack() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_attack", "");
  }

  async function cancelBattleInstance() {
    if (!websocket) return undefined;
    return asyncEmit<Battle>(websocket, "battle_reset", "");
  }

  async function consumeItem(itemId: number) {
    if (!websocket) return undefined;

    return asyncEmit<string>(websocket, "consume_item", itemId);
  }

  async function revokeMarketListing(listingId: number) {
    if (!websocket) return undefined;

    return asyncEmit<string>(websocket, "remove_market_listing", listingId);
  }

  async function getAllWebsockets() {
    if (!websocket) return undefined;

    return asyncEmit<{ id: string; email: string }[]>(
      websocket,
      "get_all_sockets",
      ""
    );
  }

  async function sendWebsocketNotification(args: {
    to: string;
    message: string;
  }) {
    if (!websocket) return undefined;

    return asyncEmit<{ id: string; email: string }[]>(
      websocket,
      "message_socket",
      args
    );
  }

  async function purchaseMarketListing(args: {
    stack: number;
    marketListingId: number;
  }) {
    if (!websocket) return undefined;
    return asyncEmit<string>(websocket, "purchase_market_listing", args);
  }

  async function getUser(): Promise<User | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<User>(websocket, "get_user", "");
  }
  async function getParty(): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, "get_party", "");
  }

  async function createParty(): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, "create_party", "");
  }

  async function removeParty(): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, "remove_party", "");
  }

  async function getFirstMonster(): Promise<Monster | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<Monster>(websocket, "get_monster", "");
  }

  async function getFirst10Users(): Promise<User[] | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<User[]>(websocket, "get_all_user", "");
  }

  async function getFirst10MarketListing(): Promise<
    MarketListing[] | undefined
  > {
    if (!websocket) return undefined;
    return asyncEmit<MarketListing[]>(websocket, "get_all_market_listing", "");
  }

  async function equipItem(itemId: number) {
    if (!websocket) return undefined;
    return asyncEmit<string>(websocket, "equip_item", itemId);
  }

  async function unequipItem(itemId: number) {
    if (!websocket) return undefined;
    return asyncEmit<string>(websocket, "unequip_item", itemId);
  }

  return {
    users: {
      getUser,
      getFirst10Users,
    },
    party: {
      getParty,
      createParty,
      removeParty,
    },
    market: {
      createMarketListing,
      getFirst10MarketListing,
      purchaseMarketListing,
      revokeMarketListing,
    },
    battle: {
      createBattleInstance,
      requestBattleAttack,
      cancelBattleInstance,
      getBattleInstance,
    },
    admin: {
      sendWebsocketNotification,
      getAllWebsockets,
    },
    items: {
      consumeItem,
      equipItem,
      unequipItem,
    },
    getFirstMonster,
  };
}
