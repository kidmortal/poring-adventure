import { create } from "zustand";

interface CharacterCreationState {
  selectedCharacterClass: string;
  characterName: string;
  setSelectedCharacterClass: (v: string) => void;
  setCharacterName: (v: string) => void;
}

export const useCharacterCreationStore = create<CharacterCreationState>()(
  (set) => ({
    selectedCharacterClass: "",
    characterName: "",
    setCharacterName: (v) => set(() => ({ characterName: v })),
    setSelectedCharacterClass: (v) =>
      set(() => ({ selectedCharacterClass: v })),
  })
);
