declare type User = {
  id: number;
  email: string;
  name: string;
  classname: string;
  level: number;
  experience: number;
  silver: number;
  appearance: Appearance;
  inventory: InventoryItem[];
  equipment: Equipment[];
};

declare type Appearance = {
  id: number;
  head: string;
  gender: "male" | "female";
  costume: string;
  userEmail: string;
};
