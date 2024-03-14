import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function partyService({ websocket }: { websocket?: Socket }) {
  async function getParty(): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, "get_party", "");
  }

  async function removeFromParty(userEmail: string): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, "kick_from_party", userEmail);
  }

  async function createParty(): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, "create_party", "");
  }

  async function removeParty(): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, "remove_party", "");
  }

  async function inviteToParty(email: string): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, "invite_to_party", email);
  }

  async function joinParty(partyId: number): Promise<boolean> {
    if (!websocket) return false;
    return asyncEmit<boolean>(websocket, "join_party", partyId);
  }

  return {
    getParty,
    createParty,
    removeParty,
    inviteToParty,
    joinParty,
    removeFromParty,
  };
}
