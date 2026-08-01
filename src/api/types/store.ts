// Server entities returned by the websocket API — mirrors of the backend models.
export {};

declare global {
  type UserPurchase = {
    id: number;
    transactionId: string;
    appUserId: string;
    received: boolean;
    refunded: boolean;
    createdAt: string;
    storeProductId: number;
    userEmail: string;
    product: StoreProduct;
  };

  type StoreProduct = {
    id: number;
    name: string;
    displayName: string;
    /** Rewards delivered to the mailbox when the purchase is claimed */
    silver: number;
    itemId: number | null;
    itemStack: number;
  };

  /** Result of claiming or refunding a purchase */
  type PurchaseActionResult = {
    success: boolean;
    message: string;
  };
}
