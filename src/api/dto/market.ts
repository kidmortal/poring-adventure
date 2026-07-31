// Payloads sent to the websocket API.
import { ItemCategory } from '@/constants';

export {};

declare global {
  type CreateMarketListingDto = {
    price: number;
    stack: number;
    inventoryId: number;
  };

  type PuchaseMarketListingDto = {
    marketListingId: number;
    stack: number;
  };

  type RemoveMarketListingDto = {
    marketListingId: number;
  };

  type GetAllMarketListingDto = {
    page: number;
    category: ItemCategory;
  };
}
