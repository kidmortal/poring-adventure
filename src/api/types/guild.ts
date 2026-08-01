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

  type GuildBlessing = {
    id: number;
    guildId: number;
    health: number;
    mana: number;
    str: number;
    int: number;
    agi: number;
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
  };

  interface GuildApplication {
    id: number;
    userEmail: string;
    guildId: number;
    user: User;
  }
}
