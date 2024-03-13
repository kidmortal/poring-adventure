declare type Battle = {
  users: User[];
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
  dropedItems: BattleUserDropedItem[];
};

declare type BattleUserDropedItem = {
  stack: number;
  itemId: number;
  item: Item;
};
