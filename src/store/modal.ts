import { create } from 'zustand';

type GenericModalState = {
  open: boolean;
};

type InventoryItemState = {
  open: boolean;
  selectedItem?: InventoryItem | Equipment;
};

type SellItemState = {
  open?: boolean;
  amount?: number;
  price?: number;
};

type BuyItemState = {
  open?: boolean;
  amount?: number;
  marketListing?: MarketListing;
};

type PartyInfoState = {
  open?: boolean;
  party?: Party;
};

type GuildInfoState = {
  open?: boolean;
  guild?: Guild;
};

type InteractUserState = {
  open?: boolean;
  user?: User;
};

export interface ModalState {
  userConfig: GenericModalState;
  setUserConfig: (v: GenericModalState) => void;
  discordIntegration: GenericModalState;
  setDiscordIntegration: (v: GenericModalState) => void;
  guildBlessing: GenericModalState;
  setGuildBlessing: (v: GenericModalState) => void;
  guildInfo: GuildInfoState;
  setGuildInfo: (v: GuildInfoState) => void;
  mailBox: GenericModalState;
  setMailBox: (v: GenericModalState) => void;
  guildTaskSelect: GenericModalState;
  setGuildTaskSelect: (v: GenericModalState) => void;
  inventoryItem: InventoryItemState;
  setInventoryItem: (v: InventoryItemState) => void;
  sellItem: SellItemState;
  setSellItem: (v: SellItemState) => void;
  buyItem: BuyItemState;
  setBuyItem: (v: BuyItemState) => void;
  partyInfo: PartyInfoState;
  setPartyInfo: (v: PartyInfoState) => void;
  friendlist: GenericModalState;
  setFriendlist: (v: GenericModalState) => void;
  interactUser: InteractUserState;
  setInteractUser: (v: InteractUserState) => void;
  skillbook: GenericModalState;
  setSkillbook: (v: GenericModalState) => void;
  editCharacter: GenericModalState;
  setEditCharacter: (v: GenericModalState) => void;
  confirmDeleteCharacter: { open: boolean };
  setConfirmDeleteCharacter: (v: { open: boolean }) => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  userConfig: { open: false },
  setUserConfig: (v) => set(() => ({ userConfig: v })),
  discordIntegration: { open: false },
  setDiscordIntegration: (v) => set(() => ({ discordIntegration: v })),
  guildBlessing: { open: false },
  setGuildBlessing: (v) => set(() => ({ guildBlessing: v })),
  inventoryItem: { open: false },
  buyItem: { amount: 1 },
  partyInfo: { open: false },
  friendlist: { open: false },
  interactUser: { open: false },
  skillbook: { open: false },
  confirmDeleteCharacter: { open: false },
  guildInfo: { open: false },
  guildTaskSelect: { open: false },
  mailBox: { open: false },
  sellItem: {
    open: false,
    amount: 1,
    price: 5,
  },
  editCharacter: {
    open: false,
  },
  setMailBox: (v) => set(() => ({ mailBox: v })),
  setGuildTaskSelect: (v) => set(() => ({ guildTaskSelect: v })),
  setGuildInfo: (v) => set(() => ({ guildInfo: v })),
  setEditCharacter: (v) => set(() => ({ editCharacter: v })),
  setConfirmDeleteCharacter: (v) => set(() => ({ confirmDeleteCharacter: v })),
  setSkillbook: (v) => set(() => ({ skillbook: v })),
  setInventoryItem: (v) => set((state) => ({ inventoryItem: { ...state.inventoryItem, ...v } })),
  setSellItem: (v) => set((state) => ({ sellItem: { ...state.sellItem, ...v } })),
  setBuyItem: (v) => set((state) => ({ buyItem: { ...state.buyItem, ...v } })),
  setPartyInfo: (v) => set((state) => ({ partyInfo: { ...state.partyInfo, ...v } })),
  setFriendlist: (v) => set((state) => ({ friendlist: { ...state.friendlist, ...v } })),
  setInteractUser: (v) => set((state) => ({ interactUser: { ...state.interactUser, ...v } })),
}));
