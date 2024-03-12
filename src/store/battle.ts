import { create } from "zustand";

export interface BattleState {
  battle?: Battle;
  setBattle: (v?: Battle) => void;
}

export const useBattleStore = create<BattleState>()((set) => ({
  battle: undefined,
  setBattle: (v) => set(() => ({ battle: v })),
}));
