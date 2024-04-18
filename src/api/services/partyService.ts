import { Socket } from 'socket.io-client';
import { asyncEmit } from '../websocketServer';

export function partyService({ websocket }: { websocket?: Socket }) {
  async function createParty(): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, 'create_party', '');
  }
  async function removeParty(): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, 'remove_party', '');
  }
  async function getParty(dto: GetPartyDto): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, 'get_party', dto);
  }

  async function kickFromParty(dto: KickFromPartyDto): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, 'kick_from_party', dto);
  }

  async function quitParty(dto: QuitPartyDto): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, 'quit_party', dto);
  }

  async function inviteToParty(dto: InviteToPartyDto): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, 'invite_to_party', dto);
  }

  async function joinParty(dto: JoinPartyDto): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, 'join_party', dto);
  }

  return {
    getParty,
    createParty,
    removeParty,
    inviteToParty,
    quitParty,
    joinParty,
    kickFromParty,
  };
}
