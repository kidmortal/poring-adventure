declare type Guild = {
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
};

declare type CurrentGuildTask = {
  id: number;
  guildTaskId: number;
  remainingKills: number;
  guildId: number;
  task: GuildTask;
};

declare type GuildTask = {
  id: number;
  name: string;
  mapId: number;
  killCount: number;
  taskPoints: number;
  target: MonsterMap;
};

declare type GuildMember = {
  id: number;
  role: string;
  permissionLevel: number;
  contribution: number;
  guildTokens: number;
  userEmail: string;
  guildId: number;
  user: User;
};

declare interface GuildApplication {
  id: number;
  userEmail: string;
  guildId: number;
  user: User;
}
