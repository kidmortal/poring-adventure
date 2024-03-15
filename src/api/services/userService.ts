import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function userService({ websocket }: { websocket?: Socket }) {
  async function createUser(
    payload: CreateUserPayload
  ): Promise<User | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<User>(websocket, "create_user", payload);
  }

  async function deleteUser(): Promise<User | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<User>(websocket, "delete_user", "");
  }

  async function getUser(): Promise<User | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<User>(websocket, "get_user", "");
  }

  async function getFirst10Users(): Promise<User[] | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<User[]>(websocket, "get_all_user", "");
  }

  async function getAllProfessions(): Promise<Profession[] | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<Profession[]>(websocket, "get_all_professions", "");
  }

  return {
    createUser,
    getUser,
    deleteUser,
    getFirst10Users,
    getAllProfessions,
  };
}
