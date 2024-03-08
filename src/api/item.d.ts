declare type Item = {
  id: number;
  name: string;
  category: string;
  image: string;
};

declare type Equipment = {
  id: number;
  userEmail: string;
  itemId: number;
  item: Item;
};

declare type InventoryItem = {
  id: number;
  stack: number;
  userEmail: string;
  itemId: number;
  item: Item;
  marketListing?: MarketListing;
};
