// Payloads sent to the websocket API.
export {};

declare global {
  type BattleCreateDto = {
    mapId: number;
  };

  type BattleAttackDto = {
    targetName?: string;
  };

  type BattleCastDto = {
    skillId: number;
    targetName?: string;
  };
}
