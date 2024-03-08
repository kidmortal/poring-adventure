import { useMainStore } from "@/store/main";

export function useWebsocketApi() {
  const { websocket } = useMainStore();

  async function createMarketListing(args: {
    price: number;
    stack: number;
    itemId: number;
  }) {
    if (!websocket) return false;
    return new Promise(function (resolve) {
      websocket.emit("create_market_listing", args, (msg: string) => {
        resolve(msg);
      });
    });
  }

  return { createMarketListing };
}
