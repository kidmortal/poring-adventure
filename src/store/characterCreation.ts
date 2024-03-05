import { create } from "zustand";

interface CharacterCreationState {
  selectedCharacterClass: string;
  characterName: string;
  gender: "male" | "female";
  setSelectedCharacterClass: (v: string) => void;
  setCharacterName: (v: string) => void;
  setGender: (v: "male" | "female") => void;
}

export const useCharacterCreationStore = create<CharacterCreationState>()(
  (set) => ({
    selectedCharacterClass: "knight",
    characterName: "",
    gender: "male",
    setGender: (v) => set(() => ({ gender: v })),
    setCharacterName: (v) => set(() => ({ characterName: v })),
    setSelectedCharacterClass: (v) =>
      set(() => ({ selectedCharacterClass: v })),
  })
);
