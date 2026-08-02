// Server entities returned by the websocket API — mirrors of the backend models.
export {};

declare global {
  type Battle = {
    users: BattleUser[];
    monsters: Monster[];
    attackerTurn: number;
    attackerList: string[];
    battleFinished: boolean;
    userLost: boolean;
    log: BattleLog[];
    drops: BattleDrop[];
    /** Passes through the attack order, counted from 1. */
    round: number;
    /** Swings the monster has taken while enraged — 0 until it turns. */
    enrageStacks: number;
    /** A guild boss fight, which ends back at the guild rather than the maps. */
    guildBoss?: boolean;
  };

  type BattleLog = {
    icon?: string;
    message: string;
  };

  type BattleDrop = {
    userEmail: string;
    silver: number;
    exp: number;
    dropedItems: BattleUserDropedItem[];
  };

  type BattleUserDropedItem = {
    stack: number;
    itemId: number;
    item: Item;
  };
}
