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
    class?: Class;
    /** Crafting and gathering trades the user has learned. */
    professions?: UserProfession[];
    guildMember?: GuildMember;
    /** The player's own pending guild applications. */
    guildApplications?: GuildApplication[];
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
    /** Flat mitigation from class levels and gear. */
    defense: number;
    /** Percent chance a hit or a heal lands critical. Everyone starts on 5. */
    critRate: number;
    /** What a critical is worth, as a percent of the plain value. 200 is double. */
    critDamage: number;
    stamina: number;
    maxStamina: number;
    staminaRefilledAt: string;
    userEmail: string;
  };

  type Gender = 'male' | 'female';

  /** Selectable head sprite, keyed by gender. */
  type Head = {
    id: number;
    name: string;
    gender: Gender;
    image: string;
  };

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
    /**
     * What is left of a barrier's pool. Only present on a barrier buff, and only
     * during a fight — its size comes from the caster's stats when it went up.
     */
    barrier?: number;
  };

  type Buff = {
    id: number;
    name: string;
    /** power_up, invincible, parry, well_fed, blessed, barrier, second_wind. */
    effect?: string;
    duration: number;
    image: string;
    pose: string;
    persist: boolean;
    maxStack: number;
    /** Percentages the "well_fed" effect reads. Meals carry these. */
    attackBonus?: number;
    healthBonus?: number;
    /** Percentage points added to the holder's crit while the buff is up. */
    critRateBonus?: number;
    critDamageBonus?: number;
  };
}
