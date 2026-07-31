// Server entities returned by the websocket API — mirrors of the backend models.
export {};

declare global {
  type MarketListing = {
    id: number;
    price: number;
    stack: number;
    inventoryId: number;
    sellerEmail: string;
    createdAt: string;
    updatedAt: string;
    expiresAt: string;
    inventory: InventoryItem;
    seller: User;
  };
}
