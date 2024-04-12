import { ServerInfo } from "@/api/services/adminService";
import { create } from "zustand";

export interface AdminStoreState {
  connectedUsers: User[];
  serverInfo?: ServerInfo;
  setConnectedUsers: (v: User[]) => void;
  setServerInfo: (v: ServerInfo) => void;
}

export const useAdminStore = create<AdminStoreState>()((set) => ({
  connectedUsers: [],
  serverInfo: undefined,
  setServerInfo: (v) => set(() => ({ serverInfo: v })),
  setConnectedUsers: (v) => set(() => ({ connectedUsers: v })),
}));
