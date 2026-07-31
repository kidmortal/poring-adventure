// Payloads sent to the websocket API.
export {};

declare global {
  /** Every item action addresses one inventory row. */
  type InventoryIdDto = {
    inventoryId: number;
  };

  type ConsumeItemDto = InventoryIdDto;
  type EquipItemDto = InventoryIdDto;
  type UnequipItemDto = InventoryIdDto;
  type EnhanceItemDto = InventoryIdDto;
  type UpgradeItemDto = InventoryIdDto;
}
