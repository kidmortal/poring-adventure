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
    /**
     * Which leg of a dungeon run this is. Set, the results screen offers the
     * next boss instead of a rematch — there is no rematch on one entry a day.
     */
    dungeon?: DungeonBattleInfo;
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
