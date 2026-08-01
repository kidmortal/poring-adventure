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
    drops: Drop[];
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
