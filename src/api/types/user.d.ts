declare type User = {
  id: number;
  email: string;
  name: string;
  classname: string;
  silver: number;
  appearance: Appearance;
  admin?: boolean;
  stats?: Stats;
  inventory: InventoryItem[];
  equipment: Equipment[];
  learnedSkills: LearnedSkill[];
  profession: Profession;
};

declare type Stats = {
  id: number;
  level: number;
  experience: number;
  health: number;
  maxHealth: number;
  mana: number;
  maxMana: number;
  attack: number;
  str: number;
  agi: number;
  int: number;
  userEmail: string;
};

declare type Appearance = {
  id: number;
  head: string;
  gender: "male" | "female";
  costume: string;
  userEmail: string;
};

declare type Party = {
  id?: number;
  leaderEmail?: string;
  members?: User[];
};
