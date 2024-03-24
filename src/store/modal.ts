import { create } from "zustand";

type UserConfigState = {
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

type InteractUserState = {
  open?: boolean;
  user?: User;
};

type EditCharacterState = {
  open?: boolean;
};

type SkillbookState = {
  open?: boolean;
};

type FriendListState = {
  open?: boolean;
};

export interface ModalState {
  userConfig: UserConfigState;
  setUserConfig: (v: UserConfigState) => void;
  inventoryItem: InventoryItemState;
  setInventoryItem: (v: InventoryItemState) => void;
  sellItem: SellItemState;
  setSellItem: (v: SellItemState) => void;
  buyItem: BuyItemState;
  setBuyItem: (v: BuyItemState) => void;
  partyInfo: PartyInfoState;
  setPartyInfo: (v: PartyInfoState) => void;
  friendlist: FriendListState;
  setFriendlist: (v: FriendListState) => void;
  interactUser: InteractUserState;
  setInteractUser: (v: InteractUserState) => void;
  skillbook: SkillbookState;
  setSkillbook: (v: SkillbookState) => void;
  editCharacter: EditCharacterState;
  setEditCharacter: (v: EditCharacterState) => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  userConfig: { open: false },
  inventoryItem: { open: false },
  buyItem: { amount: 1 },
  partyInfo: { open: false },
  friendlist: { open: false },
  interactUser: { open: false },
  skillbook: { open: false },
  sellItem: {
    open: false,
    amount: 1,
    price: 5,
  },
  editCharacter: {
    open: false,
  },
  setEditCharacter: (v) => set(() => ({ editCharacter: v })),
  setUserConfig: (v) => set(() => ({ userConfig: v })),
  setSkillbook: (v) => set(() => ({ skillbook: v })),
  setInventoryItem: (v) =>
    set((state) => ({ inventoryItem: { ...state.inventoryItem, ...v } })),
  setSellItem: (v) =>
    set((state) => ({ sellItem: { ...state.sellItem, ...v } })),
  setBuyItem: (v) => set((state) => ({ buyItem: { ...state.buyItem, ...v } })),
  setPartyInfo: (v) =>
    set((state) => ({ partyInfo: { ...state.partyInfo, ...v } })),
  setFriendlist: (v) =>
    set((state) => ({ friendlist: { ...state.friendlist, ...v } })),
  setInteractUser: (v) =>
    set((state) => ({ interactUser: { ...state.interactUser, ...v } })),
}));
