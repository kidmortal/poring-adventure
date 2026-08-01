// Payloads sent to the websocket API.
export {};

declare global {
  type BattleCreateDto = {
    mapId: number;
  };

  type BattleCastDto = {
    skillId: number;
    targetName?: string;
  };
}
