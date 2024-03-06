import { create } from "zustand";

type LoggedUserInfo = {
  loggedIn: boolean;
  accessToken: string;
  email: string;
};

interface MainState {
  loggedUserInfo: LoggedUserInfo;
  isLoading: boolean;
  clearUserData: () => void;
  setIsLoading: (v: boolean) => void;
  setUserLoggedInfo: (v: LoggedUserInfo) => void;
}

export const useMainStore = create<MainState>()((set) => ({
  isLoading: false,
  loggedUserInfo: {
    loggedIn: false,
    accessToken: "",
    email: "",
  },
  clearUserData: () =>
    set(() => ({
      loggedUserInfo: { accessToken: "", email: "", loggedIn: false },
    })),
  setUserLoggedInfo: (v) => set(() => ({ loggedUserInfo: v })),
  setIsLoading: (v) => set(() => ({ isLoading: v })),
}));
