declare type UserPurchase = {
  id: number;
  transactionId: string;
  appUserId: string;
  received: boolean;
  createdAt: string;
  storeProductId: number;
  userEmail: string;
  product: StoreProduct;
};

declare type StoreProduct = {
  id: number;
  name: string;
  displayName: string;
};
