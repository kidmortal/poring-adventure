import { create } from "zustand";

interface MainState {
  userLoggedIn: boolean;
  isLoading: boolean;
  setIsLoading: (v: boolean) => void;
  setUserLoggedIn: (v: boolean) => void;
}

export const useMainStore = create<MainState>()((set) => ({
  userLoggedIn: false,
  isLoading: false,
  setIsLoading: (v) => set(() => ({ isLoading: v })),
  setUserLoggedIn: (v) => set(() => ({ userLoggedIn: v })),
}));
