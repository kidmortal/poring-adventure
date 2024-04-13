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
  buffs?: UserBuff[];
  profession?: Profession;
  guildMember?: GuildMember;
};

declare type BattleUser = User & {
  isDead?: boolean;
  aggro?: number;
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

declare type UserBuff = {
  id: number;
  buffId: number;
  userId: number;
  duration: number;
  buff: Buff;
};

declare type Buff = {
  id: number;
  name: string;
  duration: number;
  image: string;
  pose: string;
  persist: boolean;
  maxStack: number;
};
