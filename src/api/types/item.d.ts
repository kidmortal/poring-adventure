declare type Item = {
  id: number;
  name: string;
  category: string;
  image: string;
  attack?: number;
  str?: number;
  int?: number;
  agi?: number;
  health?: number;
  mana?: number;
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

declare type UserNotification = {
  id: number;
  sender: string;
  content: string;
  claimed: boolean;
  silver: number;
  itemId: number;
  itemStack: number;
  visualized: boolean;
  userEmail: string;
  createdAt: string;
  item: Item;
};
