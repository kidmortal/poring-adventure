declare type User = {
  id: number;
  email: string;
  name: string;
  silver: number;
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
