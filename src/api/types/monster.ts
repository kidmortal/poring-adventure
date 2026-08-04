// Server entities returned by the websocket API — mirrors of the backend models.
export {};

declare global {
  type Monster = {
    id: number;
    level: number;
    boss: boolean;
    name: string;
    image: string;
    attack: number;
    health: number;
    /** Rewards for killing it, split across the party. */
    silver: number;
    exp: number;
    /** Which map it belongs to — what a rematch is opened against. */
    mapId?: number;
    drops: Drop[];
    /** What it stood up with — the health bar is drawn against this. */
    maxHealth?: number;
    /** Everything the party has stuck on it, for the icons beside its bar. */
    debuffs?: BattleDebuff[];
  };

  /**
   * A debuff as it sits on a monster mid-fight. It never outlives the battle, so
   * unlike a Buff there is no row of it on the player to fetch.
   */
  type BattleDebuff = {
    name: string;
    /** defense_down, attack_down, poison, stun. */
    effect: string;
    image: string;
    potency: number;
    /** Turns of the monster's own turns still to run. */
    duration: number;
  };

  /** The catalogue entry a skill points at, before it is put on anything. */
  type Debuff = BattleDebuff & {
    id: number;
    maxStack: number;
  };

  type Drop = {
    id: number;
    chance: number;
    minAmount: number;
    maxAmount: number;
    monsterId: number;
    itemId: number;
    item: Item;
  };

  type MonsterMap = {
    id: number;
    name: string;
    image: string;
    monster: Monster[];
  };
}
