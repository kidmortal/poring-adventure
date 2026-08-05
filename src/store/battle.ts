import { create } from "zustand";

export interface BattleState {
  battle?: Battle;
  isTargetingSkill: boolean;
  /**
   * The monster the player picked to swing at. A name rather than an index,
   * because the server resolves it by name and falls through to whatever is
   * standing if this one died before the turn came round.
   */
  targetName?: string;
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
  setTargetName: (v?: string) => void;
  setCameFromDungeon: (v: boolean) => void;
}

export const useBattleStore = create<BattleState>()((set) => ({
  battle: undefined,
  isTargetingSkill: false,
  targetName: undefined,
  isCasting: false,
  skillId: undefined,
  cameFromDungeon: false,
  setBattle: (v) => set(() => ({ battle: v })),
  setCameFromDungeon: (v) => set(() => ({ cameFromDungeon: v })),
  setSkillId: (v) => set(() => ({ skillId: v })),
  setIsTargetingSkill: (v) => set(() => ({ isTargetingSkill: v })),
  setTargetName: (v) => set(() => ({ targetName: v })),
  setIsCasting: (v) => set(() => ({ isCasting: v })),
}));
