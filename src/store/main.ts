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
  wsAuthenticated: boolean;
  marketListings: MarketListing[];
  clearUserData: () => void;
  setIsLoading: (v: boolean) => void;
  setMarketListings: (v: MarketListing[]) => void;
  setWebsocket: (v?: Socket) => void;
  setWsAuthenticated: (v?: boolean) => void;
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
  wsAuthenticated: false,
  userCharacterData: undefined,
  marketListings: [],
  setMarketListings: (v) => set(() => ({ marketListings: v })),
  clearUserData: () =>
    set(() => ({
      loggedUserInfo: { accessToken: "", email: "", loggedIn: false },
    })),
  setWebsocket: (v) => set(() => ({ websocket: v })),
  setWsAuthenticated: (v) => set(() => ({ wsAuthenticated: v })),
  setUserLoggedInfo: (v) => set(() => ({ loggedUserInfo: v })),
  setUserCharacterData: (v) => set(() => ({ userCharacterData: v })),
  setIsLoading: (v) => set(() => ({ isLoading: v })),
}));
