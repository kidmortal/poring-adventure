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

declare type InventoryItem = {
  id: number;
  stack: number;
  userEmail: string;
  itemId: number;
  item: Item;

  quality: number;
  enhancement: number;

  equipped: boolean;
  locked: boolean;

  marketListing?: MarketListing;
};

declare type Mail = {
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

const ITEM_CATEGORIES = ['all', 'equipment', 'consumable', 'material'] as const;

declare type ItemCategory = (typeof ITEM_CATEGORIES)[number];
