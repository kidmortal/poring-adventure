import { create } from "zustand";

export interface UserStoreState {
  mailBox: Mail[];
  guild?: Guild;
  user?: User;
  purchases?: UserPurchase[];
  setPurchases: (v?: UserPurchase[]) => void;
  setMailBox: (v: Mail[]) => void;
  setGuild: (v?: Guild) => void;
  setUser: (v?: User) => void;
  resetStore: () => void;
}

export const useUserStore = create<UserStoreState>()((set) => ({
  mailBox: [],
  purchases: [],
  guild: undefined,
  user: undefined,
  setPurchases: (v) => set(() => ({ purchases: v })),
  setUser: (v) => set(() => ({ user: v })),
  setGuild: (v) => set(() => ({ guild: v })),
  setMailBox: (v) => set(() => ({ mailBox: v })),
  resetStore: () =>
    set(() => ({ user: undefined, guild: undefined, mailBox: [] })),
}));
