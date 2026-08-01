// Payloads sent to the websocket API.
export {};

declare global {
  type ProfessionIdDto = {
    professionId: number;
  };

  type GatherDto = {
    nodeId: number;
  };

  type CraftDto = {
    recipeId: number;
  };
}
