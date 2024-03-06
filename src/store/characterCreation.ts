import { create } from "zustand";

type Gender = "male" | "female";
interface CharacterCreationState {
  selectedCharacterClass: string;
  characterName: string;
  gender: Gender;
  setSelectedCharacterClass: (v: string) => void;
  setCharacterName: (v: string) => void;
  setGender: (v: Gender) => void;
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
