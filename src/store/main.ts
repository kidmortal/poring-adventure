import { create } from "zustand";

type LoggedUserInfo = {
  loggedIn: boolean;
  accessToken: string;
  email: string;
};

interface MainState {
  loggedUserInfo: LoggedUserInfo;
  isLoading: boolean;
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
  setUserLoggedInfo: (v) => set(() => ({ loggedUserInfo: v })),
  setIsLoading: (v) => set(() => ({ isLoading: v })),
}));
