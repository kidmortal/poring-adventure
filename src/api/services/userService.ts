import { Socket } from "socket.io-client";
import { asyncEmit } from "../websocketServer";

export function userService({ websocket }: { websocket?: Socket }) {
  async function createUser(
    payload: CreateUserPayload
  ): Promise<User | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<User>(websocket, "create_user", payload);
  }

  async function updateUserName(newName: string): Promise<User | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<User>(websocket, "update_user_name", newName);
  }

  async function deleteUser(): Promise<User | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<User>(websocket, "delete_user", "");
  }

  async function getUser(): Promise<User | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<User>(websocket, "get_user", "");
  }

  async function getRankingUsers(params: { page: number }) {
    if (!websocket) return undefined;
    return asyncEmit<{ users: User[]; count: number }>(
      websocket,
      "get_all_user",
      params
    );
  }

  async function getAllClasses(): Promise<Class[] | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<Class[]>(websocket, "get_all_classes", "");
  }

  async function getAllHeads(): Promise<Head[] | undefined> {
    if (!websocket) return undefined;
    return asyncEmit<Head[]>(websocket, "get_all_heads", "");
  }

  return {
    createUser,
    updateUserName,
    getUser,
    deleteUser,
    getRankingUsers,
    getAllClasses,
    getAllHeads,
  };
}
