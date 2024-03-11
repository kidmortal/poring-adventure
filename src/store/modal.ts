import { create } from "zustand";

type UserConfigState = {
  open: boolean;
  param?: string;
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

interface ModalState {
  userConfig: UserConfigState;
  setUserConfig: (v: UserConfigState) => void;
  inventoryItem: InventoryItemState;
  setInventoryItem: (v: InventoryItemState) => void;
  sellItem: SellItemState;
  setSellItem: (v: SellItemState) => void;
  buyItem: BuyItemState;
  setBuyItem: (v: BuyItemState) => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  userConfig: {
    open: false,
  },
  inventoryItem: {
    open: false,
  },
  sellItem: {
    open: false,
    amount: 1,
    price: 5,
  },
  buyItem: {
    amount: 1,
  },
  setInventoryItem: (v) =>
    set((state) => ({ inventoryItem: { ...state.inventoryItem, ...v } })),
  setUserConfig: (v) =>
    set((state) => ({ userConfig: { ...state.userConfig, ...v } })),
  setSellItem: (v) =>
    set((state) => ({ sellItem: { ...state.sellItem, ...v } })),
  setBuyItem: (v) => set((state) => ({ buyItem: { ...state.buyItem, ...v } })),
}));
