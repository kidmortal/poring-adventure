import { create } from "zustand";

interface ItemMenuState {
  isModalOpen: boolean;
  selectedItem?: InventoryItem;
  setIsModalOpen: (v: boolean) => void;
  setSelectedItem: (v?: InventoryItem) => void;
}

export const useItemMenuStore = create<ItemMenuState>()((set) => ({
  selectedItem: undefined,
  isModalOpen: false,
  setSelectedItem: (v) => set(() => ({ selectedItem: v })),
  setIsModalOpen: (v) => set(() => ({ isModalOpen: v })),
}));
