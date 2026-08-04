import { create } from "zustand";

export interface BattleState {
  battle?: Battle;
  isTargetingSkill: boolean;
  isCasting: boolean;
  skillId?: number;
  /**
   * Set when a dungeon fight is the one that just ended, so the battle page
   * comes back to the dungeon tab rather than the map list — a failed run
   * leaves nothing standing to infer it from.
   */
  cameFromDungeon: boolean;
  setBattle: (v?: Battle) => void;
  setIsCasting: (v?: boolean) => void;
  setSkillId: (v?: number) => void;
  setIsTargetingSkill: (v?: boolean) => void;
  setCameFromDungeon: (v: boolean) => void;
}

export const useBattleStore = create<BattleState>()((set) => ({
  battle: undefined,
  isTargetingSkill: false,
  isCasting: false,
  skillId: undefined,
  cameFromDungeon: false,
  setBattle: (v) => set(() => ({ battle: v })),
  setCameFromDungeon: (v) => set(() => ({ cameFromDungeon: v })),
  setSkillId: (v) => set(() => ({ skillId: v })),
  setIsTargetingSkill: (v) => set(() => ({ isTargetingSkill: v })),
  setIsCasting: (v) => set(() => ({ isCasting: v })),
}));
