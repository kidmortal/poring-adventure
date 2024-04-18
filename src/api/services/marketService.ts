import { Socket } from 'socket.io-client';
import { asyncEmit } from '../websocketServer';

export function marketService({ websocket }: { websocket?: Socket }) {
  async function createMarketListing(dto: CreateMarketListingDto) {
    if (!websocket) return undefined;
    return asyncEmit<string>(websocket, 'create_market_listing', dto);
  }

  async function removeMarketListing(dto: RemoveMarketListingDto) {
    if (!websocket) return undefined;

    return asyncEmit<string>(websocket, 'remove_market_listing', dto);
  }

  async function purchaseMarketListing(dto: PuchaseMarketListingDto) {
    if (!websocket) return undefined;
    return asyncEmit<string>(websocket, 'purchase_market_listing', dto);
  }

  async function getMarketListingPage(dto: GetAllMarketListingDto) {
    if (!websocket) return undefined;
    return asyncEmit<{ listings: MarketListing[]; count: number }>(websocket, 'get_all_market_listing', dto);
  }

  return {
    createMarketListing,
    getMarketListingPage,
    purchaseMarketListing,
    removeMarketListing,
  };
}
