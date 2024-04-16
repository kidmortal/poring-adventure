import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function marketService({ websocket }: { websocket?: Socket }) {
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

    return asyncEmit<string>(websocket, "remove_market_listing", listingId);
  }

  async function purchaseMarketListing(args: {
    stack: number;
    marketListingId: number;
  }) {
    if (!websocket) return undefined;
    return asyncEmit<string>(websocket, "purchase_market_listing", args);
  }

  async function getMarketListingPage(params: {
    page: number;
    category: ItemCategory;
  }) {
    if (!websocket) return undefined;
    return asyncEmit<{ listings: MarketListing[]; count: number }>(
      websocket,
      "get_all_market_listing",
      params
    );
  }

  return {
    createMarketListing,
    getMarketListingPage,
    purchaseMarketListing,
    revokeMarketListing,
  };
}
