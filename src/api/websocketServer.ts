import { useMainStore } from "@/store/main";

export function useWebsocketApi() {
  const { websocket, loggedUserInfo } = useMainStore();

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

  async function revokeMarketListing(listingId: number) {
    if (!websocket) return undefined;
    return new Promise(function (resolve) {
      websocket.emit("remove_market_listing", listingId, (msg: string) => {
        resolve(msg);
      });
    });
  }

  async function purchaseMarketListing(args: {
    stack: number;
    marketListingId: number;
  }) {
    if (!websocket) return undefined;
    return new Promise(function (resolve) {
      websocket.emit("purchase_market_listing", args, (msg: string) => {
        resolve(msg);
      });
    });
  }

  async function getUser(): Promise<User | undefined> {
    if (!websocket) return undefined;
    const email = loggedUserInfo.email;
    return new Promise(function (resolve) {
      websocket.emit("get_user", email, (user: User) => {
        resolve(user);
      });
    });
  }

  async function getFirstMonster(): Promise<Monster | undefined> {
    if (!websocket) return undefined;
    return new Promise(function (resolve) {
      websocket.emit("get_monster", "", (monster: Monster) => {
        console.log(monster);
        resolve(monster);
      });
    });
  }

  async function getFirst10Users(): Promise<User[] | undefined> {
    if (!websocket) return undefined;
    const email = loggedUserInfo.email;
    return new Promise(function (resolve) {
      websocket.emit("get_all_user", email, (users: User[]) => {
        resolve(users);
      });
    });
  }

  async function getFirst10MarketListing(): Promise<
    MarketListing[] | undefined
  > {
    if (!websocket) return undefined;
    const email = loggedUserInfo.email;
    return new Promise(function (resolve) {
      websocket.emit(
        "get_all_market_listing",
        email,
        (listing: MarketListing[]) => {
          resolve(listing);
        }
      );
    });
  }

  return {
    createMarketListing,
    getUser,
    getFirst10MarketListing,
    purchaseMarketListing,
    revokeMarketListing,
    getFirst10Users,
    getFirstMonster,
  };
}
