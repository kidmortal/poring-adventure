declare type Item = {
  id: number;
  name: string;
  category: string;
  image: string;
};

declare interface Equipment {
  id: number;
  userEmail: string;
  itemId: number;
  item: Item;
}

declare interface InventoryItem {
  id: number;
  stack: number;
  userEmail: string;
  itemId: number;
  item: Item;
  marketListing?: MarketListing;
}
