// Payloads sent to the websocket API.
export {};

declare global {
  type CreateUserPayload = {
    name: string;
    gender: Gender;
    classId: number;
    costume?: string;
  };

  /** Silver, one item stack, or both — with an optional note. */
  type SendGiftDto = {
    receiverEmail: string;
    silver?: number;
    inventoryId?: number;
    stack?: number;
    message?: string;
  };
}
