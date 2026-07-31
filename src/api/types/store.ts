// Server entities returned by the websocket API — mirrors of the backend models.
export {};

declare global {
  type UserPurchase = {
    id: number;
    transactionId: string;
    appUserId: string;
    received: boolean;
    createdAt: string;
    storeProductId: number;
    userEmail: string;
    product: StoreProduct;
  };

  type StoreProduct = {
    id: number;
    name: string;
    displayName: string;
  };
}
