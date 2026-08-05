// Server entities returned by the websocket API — mirrors of the backend models.
export {};

declare global {
  type Guild = {
    id: number;
    name: string;
    leaderEmail: string;
    imageUrl: string;
    level: number;
    experience: number;
    taskPoints: number;
    publicMessage: string;
    internalMessage: string;
    currentGuildTask?: CurrentGuildTask;
    members: GuildMember[];
    guildApplications: GuildApplication[];
    blessing?: GuildBlessing;
  };

  /**
   * Each field is the **total stat granted**, not a level — the level is that
   * total divided by the blessing's step, which is also what prices the next
   * upgrade. See the server's docs/guilds.md.
   */
  type GuildBlessing = {
    id: number;
    guildId: number;
    health: number;
    mana: number;
    str: number;
    int: number;
    agi: number;
    defense: number;
    critRate: number;
    critDamage: number;
    /** Extra daily profession stamina, not a combat stat. */
    stamina: number;
  };

  type CurrentGuildTask = {
    id: number;
    guildTaskId: number;
    remainingKills: number;
    guildId: number;
    task: GuildTask;
  };

  type GuildTask = {
    id: number;
    name: string;
    /**
     * Sprite of what the task asks you to kill. A map's own image is its boss,
     * so falling back to it advertises a King Poring for a poring cleanup.
     * Empty on tasks seeded before the column existed.
     */
    image: string;
    mapId: number;
    killCount: number;
    taskPoints: number;
    target: MonsterMap;
  };

  type GuildMember = {
    id: number;
    role: string;
    permissionLevel: number;
    contribution: number;
    guildTokens: number;
    userEmail: string;
    guildId: number;
    user: User;
    /** When they last spent a guild boss entry. Entries come back each UTC day. */
    bossEntryUsedAt?: string;
  };

  type GuildBossDifficulty = 'easy' | 'normal' | 'hard' | 'nightmare';

  /** A boss the guild can summon. These numbers are the easy ones. */
  type GuildBoss = {
    id: number;
    name: string;
    image: string;
    level: number;
    health: number;
    attack: number;
    taskPoints: number;
    tokens: number;
    silver: number;
    exp: number;
    requiredGuildLevel: number;
  };

  /** The boss a guild has standing, with the health pool it has left. */
  type CurrentGuildBoss = {
    id: number;
    guildId: number;
    guildBossId: number;
    difficulty: GuildBossDifficulty;
    maxHealth: number;
    health: number;
    attack: number;
    summonedAt: string;
    boss: GuildBoss;
    damage: GuildBossDamage[];
    /** What this difficulty pays on the kill, already scaled by the server. */
    reward: { taskPoints: number; tokens: number };
  };

  /** What one member has banked against the standing boss. */
  type GuildBossDamage = {
    id: number;
    currentGuildBossId: number;
    userEmail: string;
    /** The score the token payout is split by. A party banks its damage evenly. */
    damage: number;
    /** What this member personally hit for — what the contribution share reads. */
    dealtDamage: number;
    /** Set when the score was earned in a party — everyone in it shares the key. */
    partyKey?: string | null;
    /** Who led that party. */
    partyLeaderEmail?: string | null;
    user?: User;
  };

  /** Sold for guild tokens rather than silver. */
  type GuildStoreProduct = {
    id: number;
    itemId: number;
    price: number;
    stack: number;
    enabled: boolean;
    item: Item;
  };

  interface GuildApplication {
    id: number;
    userEmail: string;
    guildId: number;
    /** Absent on the copy that rides along with the applicant's own profile. */
    user?: User;
  }
}
