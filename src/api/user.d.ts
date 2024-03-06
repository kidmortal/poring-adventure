declare type User = {
  id: number;
  email: string;
  name: string;
  classname: string;
  level: number;
  experience: number;
  appearance: Appearance;
  items?: Item[];
};

declare type Appearance = {
  id: number;
  head: string;
  gender: "male" | "female";
  costume: string;
  userEmail: string;
};

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
};
