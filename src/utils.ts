function isSuccess(chance: number): boolean {
  if (chance < 0 || chance > 100) {
    throw new Error('Chance must be between 0 and 100');
  }

  const randomNum = Math.random() * 100; // Generate a random number between 0 and 100
  return randomNum < chance;
}

function enhanceChance(enhanceLevel: number): number {
  let currentChance = 100;
  for (let index = 0; index < enhanceLevel; index++) {
    currentChance -= Math.round(currentChance * 0.1);
  }
  return currentChance;
}

function enhancePrice(enhanceLevel: number): number {
  let currentPrice = 100;
  for (let index = 0; index < enhanceLevel; index++) {
    currentPrice += Math.round(currentPrice * 0.5);
  }
  return currentPrice;
}

function randomDamage(value: number, oscillationPercentage: number): number {
  // Calculate the minimum and maximum values based on the oscillation percentage
  const min = value - Math.round((value * oscillationPercentage) / 100);
  const max = value + Math.round((value * oscillationPercentage) / 100);

  // Generate a random number within the range [min, max] and round it
  return Math.round(Math.random() * (max - min) + min);
}
function getRandomNumberBetween(min: number, max: number): number {
  if (min > max) {
    throw new Error('Min number must be less than or equal to max number');
  }

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
/**
 * What quality alone is worth: 1 Common through 5 Legendary, 15% a tier.
 *
 * Mirrors the server. It used to be folded into the enhancement term, which
 * meant it vanished at +0 — a Legendary sword fresh off the anvil showed the
 * same numbers as a Common one.
 */
function qualityMultiplier(quality: number) {
  return 1 + (Math.max(quality, 1) - 1) * 0.15;
}

/** Quality is the floor; enhancement builds on it and quality amplifies it. */
function itemStatsMultiplier(quality: number, enhancement: number) {
  return qualityMultiplier(quality) + enhancement * 0.2 * (quality * 0.5);
}

function getLevelFromExp(exp: number) {
  let level = 1;
  let expNeeded = 0;
  let currentExp = 0;

  while (exp >= currentExp) {
    expNeeded = level * 100;
    currentExp += expNeeded;
    if (exp >= currentExp) {
      level++;
    }
  }

  return level;
}

function removeElementFromList<T>(args: { list: T[]; element: T }): boolean {
  const index = args.list.indexOf(args.element);
  if (index !== -1) {
    args.list.splice(index, 1);
    return true;
  }
  return false;
}
function formatMemory(memory?: number) {
  if (!memory) return '';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];

  let index = 0;
  let value = memory;

  while (value >= 1024 && index < units.length - 1) {
    value /= 1024;
    index++;
  }

  return `${value.toFixed(2)} ${units[index]}`;
}

/**
 * How likely each quality is for a crafter of this level — mirrors the server
 * rule, so the table shown before a craft is the one that gets rolled.
 */
function craftQualityChances(level: number): { quality: number; chance: number }[] {
  const safeLevel = Math.max(level, 1);
  const uncommon = Math.min(safeLevel * 6, 40);
  const rare = Math.min(Math.floor(safeLevel * 3), 25);
  const epic = Math.min(Math.floor(safeLevel * 1.2), 12);
  const legendary = Math.min(Math.floor(safeLevel * 0.4), 8);

  return [
    { quality: 1, chance: 100 - uncommon - rare - epic - legendary },
    { quality: 2, chance: uncommon },
    { quality: 3, chance: rare },
    { quality: 4, chance: epic },
    { quality: 5, chance: legendary },
  ];
}

export const Utils = {
  craftQualityChances,
  isSuccess,
  enhanceChance,
  enhancePrice,
  getRandomNumberBetween,
  getLevelFromExp,
  itemStatsMultiplier,
  qualityMultiplier,
  randomDamage,
  removeElementFromList,
  formatMemory,
};
