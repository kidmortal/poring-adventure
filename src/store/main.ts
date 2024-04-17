import { Socket } from 'socket.io-client';
import { create } from 'zustand';

export type LoggedUserInfo = {
  loggedIn: boolean;
  accessToken: string;
  email: string;
};

type MarketFilter = {
  page: number;
  category: ItemCategory;
};

export type InventoryFilters = ItemCategory;

export interface MainStoreState {
  loggedUserInfo: LoggedUserInfo;
  isLoading: boolean;
  websocket?: Socket;
  wsAuthenticated: boolean;
  marketListings: MarketListing[];
  marketFilters: MarketFilter;
  inventoryFilter: InventoryFilters;
  rankingPage: number;
  setRankingPage: (v: number) => void;
  setMarketFilterPage: (page: number) => void;
  setMarketFilterCategory: (page: ItemCategory) => void;
  setInventoryFilter: (v: InventoryFilters) => void;
  clearUserData: () => void;
  setIsLoading: (v: boolean) => void;
  setMarketListings: (v: MarketListing[]) => void;
  setWebsocket: (v?: Socket) => void;
  setWsAuthenticated: (v?: boolean) => void;
  setUserLoggedInfo: (v: LoggedUserInfo) => void;
  resetStore: () => void;
}

export const useMainStore = create<MainStoreState>()((set) => ({
  isLoading: false,
  loggedUserInfo: {
    loggedIn: false,
    accessToken: '',
    email: '',
  },
  marketFilters: {
    page: 1,
    category: 'all',
  },
  rankingPage: 1,
  setRankingPage: (v) => set(() => ({ rankingPage: v })),
  setMarketFilterPage: (v) => set((state) => ({ marketFilters: { ...state.marketFilters, page: v } })),
  setMarketFilterCategory: (v) => set((state) => ({ marketFilters: { ...state.marketFilters, category: v } })),
  websocket: undefined,
  wsAuthenticated: false,
  inventoryFilter: 'all',
  marketListings: [],
  setInventoryFilter: (v) => set(() => ({ inventoryFilter: v })),
  setMarketListings: (v) => set(() => ({ marketListings: v })),
  clearUserData: () => set(() => ({ loggedUserInfo: { accessToken: '', email: '', loggedIn: false } })),
  setWebsocket: (v) => set(() => ({ websocket: v })),
  setWsAuthenticated: (v) => set(() => ({ wsAuthenticated: v })),
  setUserLoggedInfo: (v) => set(() => ({ loggedUserInfo: v })),
  setIsLoading: (v) => set(() => ({ isLoading: v })),
  resetStore: () =>
    set(() => ({
      websocket: undefined,
      wsAuthenticated: undefined,
      loggedUserInfo: { loggedIn: false, accessToken: '', email: '' },
    })),
}));
