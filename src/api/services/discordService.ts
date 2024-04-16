import { Socket } from 'socket.io-client';
import { asyncEmit } from '../websocketServer';

export function discordService({ websocket }: { websocket?: Socket }) {
  async function createToken() {
    if (!websocket) return undefined;
    return asyncEmit<string>(websocket, 'create_discord_register_token', '');
  }
  async function getProfile() {
    if (!websocket) return undefined;
    return asyncEmit<DiscordProfile>(websocket, 'get_profile', '');
  }

  return {
    createToken,
    getProfile,
  };
}
