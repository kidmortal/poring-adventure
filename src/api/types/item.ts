// Server entities returned by the websocket API — mirrors of the backend models.
export {};

declare global {
  type Item = {
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

  type InventoryItem = {
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

  type Mail = {
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

  /**
   * Something that happened while you were away — a hired service being used,
   * and what it earned you. Nothing to claim: the reward is already paid.
   */
  type GameNotification = {
    id: number;
    userEmail: string;
    /** hired_craft, hired_enhance, or info. Decides the icon. */
    type: string;
    title: string;
    message: string;
    silver: number;
    experience: number;
    read: boolean;
    createdAt: string;
  };
}
