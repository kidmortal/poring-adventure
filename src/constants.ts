/** Item quality tiers, indexed by the numeric `quality` the API sends. */
export const ITEM_QUALITY = ['Common', 'Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythical'] as const;

export type ItemQuality = (typeof ITEM_QUALITY)[number];

/** Categories used by the inventory and market filters. */
export const ITEM_CATEGORIES = ['all', 'equipment', 'consumable', 'material'] as const;

export type ItemCategory = (typeof ITEM_CATEGORIES)[number];

/** The five slots a character wears. Mirrors `EQUIPABLE_CATEGORIES` on the API. */
export const EQUIPABLE_CATEGORIES = ['weapon', 'armor', 'legs', 'boots', 'accessory'] as const;

export type EquipableCategory = (typeof EQUIPABLE_CATEGORIES)[number];
