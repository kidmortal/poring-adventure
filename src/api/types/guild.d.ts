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
  members: GuildMember[];
};

declare type GuildMember = {
  id: number;
  role: string;
  contribution: number;
  guildTokens: number;
  userEmail: string;
  guildId: number;
  user: User;
};
