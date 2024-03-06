declare type Item = {
  id: number;
  name: string;
  category: string;
  stack: number;
  image: string;
  userEmail: string;
  marketListing: MarketListing;
};

declare type MarketListing = {
  id: number;
  price: number;
  stack: number;
  itemId: number;
  sellerEmail: string;
  createdAt: string;
  updatedAt: string;
  buyerEmail?: string;
  expiresAt?: string;
  item?: Item;
  seller?: User;
};
