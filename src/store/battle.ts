import { create } from "zustand";

export interface BattleState {
  battle?: Battle;
  isTargetingSkill: boolean;
  isCasting: boolean;
  skillId?: number;
  setBattle: (v?: Battle) => void;
  setIsCasting: (v?: boolean) => void;
  setSkillId: (v?: number) => void;
  setIsTargetingSkill: (v?: boolean) => void;
}

export const useBattleStore = create<BattleState>()((set) => ({
  battle: undefined,
  isTargetingSkill: false,
  isCasting: false,
  skillId: undefined,
  setBattle: (v) => set(() => ({ battle: v })),
  setSkillId: (v) => set(() => ({ skillId: v })),
  setIsTargetingSkill: (v) => set(() => ({ isTargetingSkill: v })),
  setIsCasting: (v) => set(() => ({ isCasting: v })),
}));
