declare type Monster = {
  id: number;
  level: number;
  boss: boolean;
  name: string;
  image: string;
  attack: number;
  health: number;
  drops: Drop[];
};

declare type Drop = {
  id: number;
  chance: number;
  minAmount: number;
  maxAmount: number;
  monsterId: number;
  itemId: number;
  item: Item;
};

declare type MonsterMap = {
  id: number;
  name: string;
  image: string;
  monster: Monster[];
};
