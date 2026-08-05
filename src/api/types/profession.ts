// Server entities returned by the websocket API — mirrors of the backend models.
export {};

declare global {
  /** "gathering" professions have nodes, "crafting" ones have recipes. */
  type ProfessionKind = 'gathering' | 'crafting';

  /**
   * A crafting or gathering trade. Professions have nothing to do with combat:
   * they are learned on top of the class, level on their own, and every action
   * they offer is paid for with stamina.
   */
  type Profession = {
    id: number;
    name: string;
    /** Emoji placeholder until real artwork is added. */
    icon: string;
    description: string;
    kind: ProfessionKind;
    /** Whether this profession may enhance items for other players. */
    canEnhance?: boolean;
    nodes?: GatheringNode[];
    recipes?: Recipe[];
  };

  /** One profession the user has learned, with its own progression. */
  type UserProfession = {
    id: number;
    userEmail: string;
    professionId: number;
    level: number;
    experience: number;
    learnedAt: string;
    profession: Profession;
  };

  type GatheringNode = {
    id: number;
    name: string;
    image: string;
    professionId: number;
    requiredLevel: number;
    staminaCost: number;
    experience: number;
    profession?: Profession;
    drops: GatheringDrop[];
  };

  type GatheringDrop = {
    id: number;
    chance: number;
    minAmount: number;
    maxAmount: number;
    nodeId: number;
    itemId: number;
    item: Item;
  };

  type Recipe = {
    id: number;
    name: string;
    professionId: number;
    requiredLevel: number;
    staminaCost: number;
    experience: number;
    itemId: number;
    amount: number;
    profession?: Profession;
    item: Item;
    ingredients: RecipeIngredient[];
  };

  type RecipeIngredient = {
    id: number;
    recipeId: number;
    itemId: number;
    amount: number;
    item: Item;
  };

  /** What a gather actually produced — drops are rolled server side. */
  type GatherResult = {
    node: string;
    experience: number;
    staminaCost: number;
    drops: { itemId: number; amount: number }[];
  };

  type CraftResult = {
    recipe: string;
    amount: number;
    experience: number;
    /** Rolled against the crafter's level: 1 Common through 5 Legendary. */
    quality: number;
  };

  /**
   * A crafter selling their stamina. Only players who published one show up on
   * the hiring board, and their remaining stamina is what limits how much work
   * they can still take.
   */
  type ServiceOffer = {
    id: number;
    crafterEmail: string;
    professionId: number;
    /** Silver charged per stamina point the job costs the crafter. */
    pricePerStamina: number;
    crafting: boolean;
    enhancing: boolean;
    createdAt: string;
    profession: Profession;
    crafter: {
      name: string;
      email: string;
      stats?: { stamina: number; maxStamina: number };
      professions: { professionId: number; level: number }[];
    };
  };

  /** What a hired craft produced, and what it cost to hire. */
  type HiredCraftResult = {
    recipe: string;
    amount: number;
    experience: number;
    quality: number;
    crafter: string;
    crafterLevel: number;
    fee: number;
  };

  /** Outcome of enhancing an item yourself. */
  type EnhanceResult = {
    item: string;
    enhancement: number;
    success: boolean;
    /** Set when the failure cost a level rather than only the forge price. */
    setback?: boolean;
    chance: number;
    forgePrice: number;
  };

  /**
   * Outcome of feeding a duplicate into an item for a chance at the next
   * rarity. `quality` is where it ended up — unchanged on a failure — and the
   * enhancement is back at zero either way.
   */
  type UpgradeResult = {
    item: string;
    success: boolean;
    chance: number;
    quality: number;
    previousQuality: number;
    enhancement: number;
    previousEnhancement: number;
    /** The enhancement the consumed duplicate was carrying. */
    consumedEnhancement: number;
  };

  type HiredEnhanceResult = {
    item: string;
    enhancement: number;
    success: boolean;
    setback?: boolean;
    chance: number;
    blacksmith: string;
    blacksmithLevel: number;
    forgePrice: number;
    fee: number;
  };

  /**
   * One standing NPC contract on today's board. The board redraws every UTC
   * day, which is what keeps demand for crafted goods coming back instead of
   * being satisfied once and for all.
   */
  type Commission = {
    id: number;
    item: Item;
    amount: number;
    silver: number;
    experience: number;
    requiredLevel: number;
    /** Whether this one has already been filled today. */
    delivered: boolean;
    /** How many the player is holding right now, across every stack. */
    owned: number;
  };

  type CommissionBoard = {
    /** null when the player has not taken up a trade yet. */
    profession: string | null;
    day: string;
    commissions: Commission[];
  };

  type DeliverCommissionResult = {
    item: string;
    amount: number;
    silver: number;
    experience: number;
  };

  /** What eating or drinking something actually did. */
  type ConsumeResult = {
    item: string;
    quality: number;
    health: number;
    mana: number;
    buff: {
      name: string;
      image: string;
      duration: number;
      attackBonus: number;
      healthBonus: number;
      /** How many people the meal reached — more than one for a Feast. */
      fed: number;
    } | null;
  };
}
