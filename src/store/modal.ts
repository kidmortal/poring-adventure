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

interface ModalState {
  userConfig: UserConfigState;
  setUserConfig: (v: UserConfigState) => void;
  inventoryItem: InventoryItemState;
  setInventoryItem: (v: InventoryItemState) => void;
  sellItem: SellItemState;
  setSellItem: (v: SellItemState) => void;
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
  setInventoryItem: (v) =>
    set((state) => ({ inventoryItem: { ...state.inventoryItem, ...v } })),
  setUserConfig: (v) =>
    set((state) => ({ userConfig: { ...state.userConfig, ...v } })),
  setSellItem: (v) =>
    set((state) => ({ sellItem: { ...state.sellItem, ...v } })),
}));
