import { create } from "zustand";

interface ItemMenuState {
  isModalOpen: boolean;
  selectedItem?: Item;
  setIsModalOpen: (v: boolean) => void;
  setSelectedItem: (v?: Item) => void;
}

export const useItemMenuStore = create<ItemMenuState>()((set) => ({
  selectedItem: undefined,
  isModalOpen: false,
  setSelectedItem: (v) => set(() => ({ selectedItem: v })),
  setIsModalOpen: (v) => set(() => ({ isModalOpen: v })),
}));
