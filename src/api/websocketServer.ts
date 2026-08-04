import { useMainStore } from '@/store/main';
import { Socket } from 'socket.io-client';
import { userService } from './services/userService';
import { partyService } from './services/partyService';
import { marketService } from './services/marketService';
import { battleService } from './services/battleService';
import { itemService } from './services/itemService';
import { adminService } from './services/adminService';
import { skillService } from './services/skillService';
import { monsterService } from './services/monsterService';
import { guildService } from './services/guildService';
import { mailService } from './services/mailService';
import { storeService } from './services/storeService';
import { discordService } from './services/discordService';
import { professionService } from './services/professionService';
import { dungeonService } from './services/dungeonService';

/** How long to wait for the server's acknowledgement before giving up on it. */
const ACK_TIMEOUT_MS = 15_000;

/**
 * Emits and resolves with the server's acknowledgement.
 *
 * The timeout is not paranoia: a handler that throws where the server cannot
 * answer, or a query that never settles, leaves this promise pending forever and
 * the screen behind it loading forever. Rejecting turns that into an error the
 * caller can show and retry.
 */
export async function asyncEmit<T>(ws: Socket, event: string, args: number | string | object): Promise<T> {
  return new Promise(function (resolve, reject) {
    const timer = setTimeout(
      () => reject(new Error(`No response from server for "${event}" after ${ACK_TIMEOUT_MS / 1000}s`)),
      ACK_TIMEOUT_MS,
    );

    ws.emit(event, args, (response: T) => {
      clearTimeout(timer);
      resolve(response);
    });
  });
}

export function useWebsocketApi() {
  const { websocket } = useMainStore();

  return {
    users: userService({ websocket }),
    party: partyService({ websocket }),
    market: marketService({ websocket }),
    battle: battleService({ websocket }),
    admin: adminService({ websocket }),
    items: itemService({ websocket }),
    monsters: monsterService({ websocket }),
    dungeons: dungeonService({ websocket }),
    skills: skillService({ websocket }),
    guild: guildService({ websocket }),
    mail: mailService({ websocket }),
    store: storeService({ websocket }),
    discord: discordService({ websocket }),
    professions: professionService({ websocket }),
  };
}

export type WebsocketApi = ReturnType<typeof useWebsocketApi>;
