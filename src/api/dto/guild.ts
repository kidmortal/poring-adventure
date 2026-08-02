// Payloads sent to the websocket API.
export {};

declare global {
  /** Most guild endpoints only need to identify the guild. */
  type GuildIdDto = {
    guildId: number;
  };

  type ApplyToGuildDto = GuildIdDto;

  type UnlockBlessingsDto = GuildIdDto;

  type UpgradeBlessingsDto = GuildIdDto & {
    blessing: string;
  };

  type KickFromGuildDto = GuildIdDto & {
    userEmail: string;
  };

  type AcceptGuildApplicationDto = {
    applicationId: number;
  };

  type RefuseGuildApplicationDto = {
    applicationId: number;
  };

  type SummonGuildBossDto = {
    bossId: number;
    difficulty: GuildBossDifficulty;
  };

  type BuyGuildStoreProductDto = {
    productId: number;
    amount?: number;
  };

  type AcceptGuildTaskDto = {
    taskId: number;
  };

  type CancelGuildTaskDto = {
    taskId: number;
  };
}
