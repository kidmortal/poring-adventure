import { useMainStore } from "@/store/main";
import { Socket } from "socket.io-client";
import { userService } from "./services/userService";
import { partyService } from "./services/partyService";
import { marketService } from "./services/marketService";
import { battleService } from "./services/battleService";
import { itemService } from "./services/itemService";
import { adminService } from "./services/adminService";
import { skillService } from "./services/skillService";
import { monsterService } from "./services/monsterService";
import { guildService } from "./services/guildService";
import { mailService } from "./services/mailService";

export async function asyncEmit<T>(
  ws: Socket,
  event: string,
  args: number | string | object
): Promise<T> {
  return new Promise(function (resolve) {
    ws.emit(event, args, (response: T) => {
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
    skills: skillService({ websocket }),
    guild: guildService({ websocket }),
    mail: mailService({ websocket }),
  };
}

export type WebsocketApi = ReturnType<typeof useWebsocketApi>;
