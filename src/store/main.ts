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
  userCharacter: any;
  fetchUserCharacter: () => Promise<void>;
  setIsLoading: (v: boolean) => void;
  setUserLoggedInfo: (v: LoggedUserInfo) => void;
}

export const useMainStore = create<MainState>()((set, get) => ({
  isLoading: false,
  userCharacter: {},
  loggedUserInfo: {
    loggedIn: false,
    accessToken: "",
    email: "",
  },
  fetchUserCharacter: async () => {
    const { loggedUserInfo } = get();
    const userCharacter = await api.getUserInfo(loggedUserInfo.email);
    set(() => ({ userCharacter }));
  },
  setUserLoggedInfo: (v) => set(() => ({ loggedUserInfo: v })),
  setIsLoading: (v) => set(() => ({ isLoading: v })),
}));
