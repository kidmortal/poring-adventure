declare type Battle = {
  users: BattleUser[];
  monsters: Monster[];
  attackerTurn: number;
  attackerList: string[];
  battleFinished: boolean;
  userLost: boolean;
  log: BattleLog[];
  drops: BattleDrop[];
};

declare type BattleLog = {
  icon?: string;
  message: string;
};

declare type BattleDrop = {
  userEmail: string;
  silver: number;
  exp: number;
  dropedItems: BattleUserDropedItem[];
};

declare type BattleUserDropedItem = {
  stack: number;
  itemId: number;
  item: Item;
};
