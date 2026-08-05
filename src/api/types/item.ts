// Server entities returned by the websocket API — mirrors of the backend models.
export {};

declare global {
  type Item = {
    id: number;
    name: string;
    category: string;
    image: string;
    /** Character level needed to equip it. 1 for anything not equipment. */
    requiredLevel: number;
    attack?: number;
    str?: number;
    int?: number;
    agi?: number;
    health?: number;
    mana?: number;
    defense?: number;
    critRate?: number;
    critDamage?: number;

    /** The buff eating it grants. What a cook's whole output is made of. */
    buffId?: number | null;
    buff?: Buff | null;
    /** Usable mid-fight, at the cost of a turn. Alchemy's output. */
    battleUse?: boolean;
    /** Feeds the whole party rather than only whoever ate it. */
    partyWide?: boolean;
    /** An action rather than a restore — currently only "escape". */
    battleEffect?: string | null;
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
