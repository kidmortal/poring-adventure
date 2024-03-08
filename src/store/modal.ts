import { create } from "zustand";

type UserConfigState = {
  open: boolean;
  param?: string;
};

type InventoryItemState = {
  open: boolean;
  selectedItem?: InventoryItem;
};

interface ModalState {
  userConfig: UserConfigState;
  setUserConfig: (v: UserConfigState) => void;
  inventoryItem: InventoryItemState;
  setInventoryItem: (v: InventoryItemState) => void;
}

export const useModalStore = create<ModalState>()((set) => ({
  userConfig: {
    open: false,
  },
  inventoryItem: {
    open: false,
  },
  setInventoryItem: (v) => set(() => ({ inventoryItem: v })),
  setUserConfig: (v) => set(() => ({ userConfig: v })),
}));
