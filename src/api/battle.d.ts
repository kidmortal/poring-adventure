declare type Battle = {
  user: User;
  monster: Monster;
  attackerTurn: string;
  battleFinished: boolean;
  userLost: boolean;
  log: string[];
  drops: BattleDrop[];
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
