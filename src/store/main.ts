import { api } from "@/api/service";
import { create } from "zustand";

type LoggedUserInfo = {
  loggedIn: boolean;
  accessToken: string;
  email: string;
};

interface MainState {
  loggedUserInfo: LoggedUserInfo;
  isLoading: boolean;
  userCharacter?: User;
  clearUserData: () => void;
  setUserCharacter: (v?: User) => void;
  fetchUserCharacter: () => Promise<boolean>;
  setIsLoading: (v: boolean) => void;
  setUserLoggedInfo: (v: LoggedUserInfo) => void;
}

export const useMainStore = create<MainState>()((set, get) => ({
  isLoading: false,
  userCharacter: undefined,
  loggedUserInfo: {
    loggedIn: false,
    accessToken: "",
    email: "",
  },
  fetchUserCharacter: async () => {
    const state = get();
    state.setIsLoading(true);
    const userCharacter = await api.getUserInfo(state.loggedUserInfo.email);
    state.setIsLoading(false);
    if (!userCharacter) {
      console.log("no character");
      return false;
    }
    set(() => ({ userCharacter }));
    return true;
  },
  clearUserData: () =>
    set(() => ({
      userCharacter: undefined,
      loggedUserInfo: { accessToken: "", email: "", loggedIn: false },
    })),
  setUserCharacter: (v) => set(() => ({ userCharacter: v })),
  setUserLoggedInfo: (v) => set(() => ({ loggedUserInfo: v })),
  setIsLoading: (v) => set(() => ({ isLoading: v })),
}));
