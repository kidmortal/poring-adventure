declare type Guild = {
  id: number;
  name: string;
  leaderEmail: string;
  imageUrl: string;
  level: number;
  experience: number;
  taskPoints: number;
  members: Member[];
};

declare type Member = {
  id: number;
  role: string;
  contribution: number;
  guildTokens: number;
  userEmail: string;
  guildId: number;
  user: User;
};
