import { create } from 'zustand';

export interface UserStoreState {
  mailBox: Mail[];
  notifications: GameNotification[];
  guild?: Guild;
  user?: User;
  party?: Party;
  partyStatus?: PartyStatus;
  setParty: (v?: Party) => void;
  setPartyStatus: (v?: PartyStatus) => void;
  purchases?: UserPurchase[];
  setPurchases: (v?: UserPurchase[]) => void;
  setMailBox: (v: Mail[]) => void;
  setNotifications: (v: GameNotification[]) => void;
  setGuild: (v?: Guild) => void;
  setUser: (v?: User) => void;
  resetStore: () => void;
}

export const useUserStore = create<UserStoreState>()((set) => ({
  mailBox: [],
  notifications: [],
  purchases: [],
  guild: undefined,
  user: undefined,
  party: undefined,
  setParty: (v) => set(() => ({ party: v })),
  partyStatus: {
    chat: [],
    isPartyOpen: false,
  },
  setPartyStatus: (v) => set(() => ({ partyStatus: v })),
  setPurchases: (v) => set(() => ({ purchases: v })),
  setUser: (v) => set(() => ({ user: v })),
  setGuild: (v) => set(() => ({ guild: v })),
  setMailBox: (v) => set(() => ({ mailBox: v })),
  setNotifications: (v) => set(() => ({ notifications: v })),
  resetStore: () => set(() => ({ user: undefined, guild: undefined, mailBox: [], notifications: [] })),
}));
