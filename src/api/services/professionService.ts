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

  async function getServiceOffers(): Promise<ServiceOffer[] | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<ServiceOffer[]>(websocket, 'get_service_offers', '');
  }

  async function getUserServiceOffer(): Promise<ServiceOffer | null | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<ServiceOffer | null>(websocket, 'get_user_service_offer', '');
  }

  async function publishServiceOffer(dto: PublishServiceOfferDto): Promise<ServiceOffer | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<ServiceOffer>(websocket, 'publish_service_offer', dto);
  }

  async function removeServiceOffer(): Promise<boolean | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<boolean>(websocket, 'remove_service_offer', '');
  }

  /** The crafter spends the stamina, you provide the materials and keep the item. */
  async function hireCraft(dto: HireCraftDto): Promise<HiredCraftResult | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<HiredCraftResult>(websocket, 'hire_craft', dto);
  }

  async function hireEnhance(dto: HireEnhanceDto): Promise<HiredEnhanceResult | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<HiredEnhanceResult>(websocket, 'hire_enhance', dto);
  }

  return {
    getAllProfessions,
    getUserProfessions,
    learnProfession,
    getGatheringNodes,
    gather,
    getRecipes,
    craft,
    getServiceOffers,
    getUserServiceOffer,
    publishServiceOffer,
    removeServiceOffer,
    hireCraft,
    hireEnhance,
  };
}
