// Server entities returned by the websocket API — mirrors of the backend models.
export {};

declare global {
  type User = {
    id: number;
    email: string;
    name: string;
    classname: string;
    silver: number;
    appearance: Appearance;
    admin?: boolean;
    stats?: Stats;
    inventory: InventoryItem[];
    learnedSkills: LearnedSkill[];
    buffs?: UserBuff[];
    profession?: Profession;
    guildMember?: GuildMember;
    partyId: number;
  };

  type BattleUser = User & {
    isDead?: boolean;
    aggro?: number;
  };

  type Stats = {
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

  type Gender = 'male' | 'female';

  type Appearance = {
    id: number;
    head: string;
    gender: Gender;
    costume: string;
    userEmail: string;
  };

  type Party = {
    id?: number;
    leaderEmail?: string;
    members?: User[];
  };

  type PartyStatus = {
    chat: string[];
    isPartyOpen: boolean;
  };

  type UserBuff = {
    id: number;
    buffId: number;
    userId: number;
    duration: number;
    buff: Buff;
  };

  type Buff = {
    id: number;
    name: string;
    duration: number;
    image: string;
    pose: string;
    persist: boolean;
    maxStack: number;
  };
}
