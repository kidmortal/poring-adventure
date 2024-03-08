import { Socket } from "socket.io-client";
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
  websocket?: Socket;
  clearUserData: () => void;
  setIsLoading: (v: boolean) => void;
  setWebsocket: (v?: Socket) => void;
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
  websocket: undefined,
  userCharacterData: undefined,
  clearUserData: () =>
    set(() => ({
      loggedUserInfo: { accessToken: "", email: "", loggedIn: false },
    })),
  setWebsocket: (v) => set(() => ({ websocket: v })),
  setUserLoggedInfo: (v) => set(() => ({ loggedUserInfo: v })),
  setUserCharacterData: (v) => set(() => ({ userCharacterData: v })),
  setIsLoading: (v) => set(() => ({ isLoading: v })),
}));
