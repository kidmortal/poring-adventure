import { create } from "zustand";

type LoggedUserInfo = {
  loggedIn: boolean;
  accessToken: string;
  email: string;
};

interface MainState {
  loggedUserInfo: LoggedUserInfo;
  isLoading: boolean;
  userCharacterData?: User;
  clearUserData: () => void;
  setIsLoading: (v: boolean) => void;
  setUserCharacterData: (v?: User) => void;
  setUserLoggedInfo: (v: LoggedUserInfo) => void;
}

export const useMainStore = create<MainState>()((set) => ({
  isLoading: false,
  loggedUserInfo: {
    loggedIn: false,
    accessToken: "",
    email: "",
  },
  userCharacterData: undefined,
  clearUserData: () =>
    set(() => ({
      loggedUserInfo: { accessToken: "", email: "", loggedIn: false },
    })),
  setUserLoggedInfo: (v) => set(() => ({ loggedUserInfo: v })),
  setUserCharacterData: (v) => set(() => ({ userCharacterData: v })),
  setIsLoading: (v) => set(() => ({ isLoading: v })),
}));
