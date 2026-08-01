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
  };
}
