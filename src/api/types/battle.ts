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
