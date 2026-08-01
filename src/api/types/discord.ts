// Server entities returned by the websocket API — mirrors of the backend models.
export {};

declare global {
  type DiscordProfile = {
    id: number;
    discordId: string;
    name: string;
    url: string;
    userEmail: string;
  };
}
