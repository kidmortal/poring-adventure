/**
 * The blessing shelf, mirrored from the server's `UPGRADE_FACTOR` and
 * `guild.rules.ts`. Both the guild panel and the upgrade modal read it, so the
 * two can never disagree about what a level is worth or what it costs.
 */

export type BlessingConfig = {
  name: string;
  /** Short label for the guild panel's chips. */
  label: string;
  /** The key on GuildBlessing, and what `upgrade_blessing` is told. */
  alias: keyof GuildBlessing;
  /** Stat granted per blessing level. */
  multiplier: number;
  /**
   * The `misc/<name>.webp` icon, shared with the character sheet's `Stat` —
   * a blessing shows the same picture as the stat it raises.
   */
  src: string;
};

export const BLESSINGS: BlessingConfig[] = [
  { name: 'Health', label: 'HP', alias: 'health', src: 'health', multiplier: 5 },
  { name: 'Mana', label: 'MP', alias: 'mana', src: 'mana', multiplier: 5 },
  { name: 'Strength', label: 'STR', alias: 'str', src: 'str', multiplier: 1 },
  { name: 'Agility', label: 'AGI', alias: 'agi', src: 'agi', multiplier: 1 },
  { name: 'Intelligence', label: 'INT', alias: 'int', src: 'int', multiplier: 1 },
  { name: 'Defense', label: 'DEF', alias: 'defense', src: 'def', multiplier: 1 },
  { name: 'Crit rate', label: 'CRIT', alias: 'critRate', src: 'critr', multiplier: 1 },
  { name: 'Crit damage', label: 'C.DMG', alias: 'critDamage', src: 'critd', multiplier: 5 },
  { name: 'Stamina', label: 'STAM', alias: 'stamina', src: 'stamina', multiplier: 1 },
];

/** Soulshards to open the shrine at all. */
export const UNLOCK_COST = 100;

/** No blessing goes past this. */
export const MAX_BLESSING_LEVEL = 20;

/**
 * What the next level costs, given how many are already bought: 100 for the
 * first and a third again for each after it, so the twentieth runs to some
 * 29,700. Kept identical to `blessingUpgradeCost` on the server — the server is
 * what actually charges, this only has to price the button honestly.
 */
export function blessingUpgradeCost(level: number) {
  return Math.round(100 * 1.35 ** Math.max(level, 0));
}

/** A column holds the total granted, so the level is that total over the step. */
export function blessingLevel(value: number, multiplier: number) {
  return Math.floor(value / multiplier);
}
