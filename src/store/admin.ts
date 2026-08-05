import { CatalogItem, ServerInfo } from '@/api/services/adminService';
import { create } from 'zustand';

type NativeServices = {
  purchase?: boolean;
  updater?: boolean;
  lockPortrait?: boolean;
};

export interface AdminStoreState {
  connectedUsers: User[];
  connectedIntegrations: string[];
  connectedSockets: number;
  nativeServices: NativeServices;
  serverInfo?: ServerInfo;
  /** The whole item catalogue, fetched once when the spawn panel opens. */
  itemCatalog: CatalogItem[];
  setItemCatalog: (v: CatalogItem[]) => void;
  setConnectedIntegrations: (v: string[]) => void;
  setNativeServices: (v: NativeServices) => void;
  setConnectedUsers: (v: User[]) => void;
  setServerInfo: (v: ServerInfo) => void;
  setConnectedSockets: (v: number) => void;
}

export const useAdminStore = create<AdminStoreState>()((set) => ({
  connectedUsers: [],
  connectedIntegrations: [],
  setConnectedIntegrations: (v) => set(() => ({ connectedIntegrations: v })),
  serverInfo: undefined,
  itemCatalog: [],
  setItemCatalog: (v) => set(() => ({ itemCatalog: v })),
  nativeServices: {},
  connectedSockets: 0,
  setConnectedSockets: (v) => set(() => ({ connectedSockets: v })),
  setNativeServices: (v) => set((s) => ({ nativeServices: { ...s.nativeServices, ...v } })),
  setServerInfo: (v) => set(() => ({ serverInfo: v })),
  setConnectedUsers: (v) => set(() => ({ connectedUsers: v })),
}));
