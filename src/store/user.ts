import { create } from "zustand";

export interface UserStoreState {
  mailBox: Mail[];
  guild?: Guild;
  setMailBox: (v: Mail[]) => void;
  setGuild: (v: Guild) => void;
}

export const useUserStore = create<UserStoreState>()((set) => ({
  mailBox: [],
  guild: undefined,
  setGuild: (v) => set(() => ({ guild: v })),
  setMailBox: (v) => set(() => ({ mailBox: v })),
}));
