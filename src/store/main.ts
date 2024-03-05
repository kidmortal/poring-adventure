import { api } from "@/api/service";
import { create } from "zustand";

type LoggedUserInfo = {
  loggedIn: boolean;
  accessToken: string;
  email: string;
};

type LoadingStates = {
  application?: boolean;
  profile?: boolean;
};

interface MainState {
  loggedUserInfo: LoggedUserInfo;
  isLoading: LoadingStates;
  userCharacter?: User;
  setUserCharacter: (v: User) => void;
  fetchUserCharacter: () => Promise<boolean>;
  setIsLoading: (v: LoadingStates) => void;
  setUserLoggedInfo: (v: LoggedUserInfo) => void;
}

export const useMainStore = create<MainState>()((set, get) => ({
  isLoading: {
    application: false,
    profile: false,
  },
  userCharacter: undefined,
  loggedUserInfo: {
    loggedIn: false,
    accessToken: "",
    email: "",
  },
  fetchUserCharacter: async () => {
    const { loggedUserInfo } = get();
    const userCharacter = await api.getUserInfo(loggedUserInfo.email);
    if (!userCharacter) {
      console.log("no character");
      return false;
    }
    set(() => ({ userCharacter }));
    return true;
  },
  setUserCharacter: (v) => set(() => ({ userCharacter: v })),
  setUserLoggedInfo: (v) => set(() => ({ loggedUserInfo: v })),
  setIsLoading: (v) => set(() => ({ isLoading: v })),
}));
