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

  type PublishServiceOfferDto = {
    pricePerStamina: number;
    crafting: boolean;
    enhancing: boolean;
  };

  type HireCraftDto = {
    offerId: number;
    recipeId: number;
  };

  type SelfEnhanceDto = {
    inventoryId: number;
  };

  type HireEnhanceDto = {
    offerId: number;
    inventoryId: number;
  };
}
