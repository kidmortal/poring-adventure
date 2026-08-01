import { Socket } from 'socket.io-client';
import { asyncEmit } from '../websocketServer';

/**
 * Crafting and gathering trades. Gathering and crafting both spend stamina and
 * push a fresh profile back over `user_update`, so the caller does not have to
 * refetch the user afterwards.
 */
export function professionService({ websocket }: { websocket?: Socket }) {
  async function getAllProfessions(): Promise<Profession[] | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<Profession[]>(websocket, 'get_all_professions', '');
  }

  async function getUserProfessions(): Promise<UserProfession[] | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<UserProfession[]>(websocket, 'get_user_professions', '');
  }

  async function learnProfession(dto: ProfessionIdDto): Promise<boolean | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(websocket, 'learn_profession', dto);
  }

  async function getGatheringNodes(): Promise<GatheringNode[] | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<GatheringNode[]>(websocket, 'get_gathering_nodes', '');
  }

  async function gather(dto: GatherDto): Promise<GatherResult | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<GatherResult>(websocket, 'gather', dto);
  }

  async function getRecipes(): Promise<Recipe[] | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<Recipe[]>(websocket, 'get_recipes', '');
  }

  async function craft(dto: CraftDto): Promise<CraftResult | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<CraftResult>(websocket, 'craft', dto);
  }

  return {
    getAllProfessions,
    getUserProfessions,
    learnProfession,
    getGatheringNodes,
    gather,
    getRecipes,
    craft,
  };
}
