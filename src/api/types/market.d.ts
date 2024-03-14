declare type MarketListing = {
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
