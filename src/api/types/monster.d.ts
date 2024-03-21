declare type Monster = {
  id: number;
  level: number;
  boss: boolean;
  name: string;
  image: string;
  attack: number;
  health: number;
};

declare type MonsterMap = {
  id: number;
  name: string;
  image: string;
  monster: Monster[];
};
