import { create } from 'zustand';

/**
 * Where a frame came from:
 * - `out`    — we emitted it
 * - `ack`    — the server's reply to one of our emits (the `asyncEmit` callback)
 * - `in`     — the server pushed it at us
 * - `system` — socket lifecycle (connect, disconnect, transport errors)
 */
export type WebsocketLogDirection = 'in' | 'out' | 'ack' | 'system';

export type WebsocketLogEntry = {
  id: number;
  at: number;
  direction: WebsocketLogDirection;
  event: string;
  payload?: unknown;
  /** Something went wrong: a transport failure or a payload that looks like an error. */
  error?: boolean;
};

/** Ring buffer: old frames are dropped so a long session cannot eat memory. */
const MAX_ENTRIES = 500;

let nextId = 0;

type WebsocketLogState = {
  entries: WebsocketLogEntry[];
  append: (entry: Omit<WebsocketLogEntry, 'id' | 'at'>) => void;
  clear: () => void;
};

export const useWebsocketLogStore = create<WebsocketLogState>()((set) => ({
  entries: [],
  append: (entry) =>
    set((state) => {
      // Newest first: the panel reads top-down and the tail is what you want.
      const entries = [{ ...entry, id: nextId++, at: Date.now() }, ...state.entries];
      return { entries: entries.slice(0, MAX_ENTRIES) };
    }),
  clear: () => set(() => ({ entries: [] })),
}));
