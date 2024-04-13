import { create } from "zustand";

export interface UserStoreState {
  mailBox: Mail[];
  guild?: Guild;
  user?: User;
  setMailBox: (v: Mail[]) => void;
  setGuild: (v: Guild) => void;
  setUser: (v: User) => void;
}

export const useUserStore = create<UserStoreState>()((set) => ({
  mailBox: [],
  guild: undefined,
  user: undefined,
  setUser: (v) => set(() => ({ user: v })),
  setGuild: (v) => set(() => ({ guild: v })),
  setMailBox: (v) => set(() => ({ mailBox: v })),
}));
