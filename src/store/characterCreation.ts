import { create } from "zustand";
interface CharacterCreationState {
  selectedClass?: Class;
  characterName: string;
  gender: Gender;
  setSelectedClass: (v: Class) => void;
  setCharacterName: (v: string) => void;
  setGender: (v: Gender) => void;
}

export const useCharacterCreationStore = create<CharacterCreationState>()(
  (set) => ({
    selectedClass: undefined,
    characterName: "",
    gender: "male",
    setGender: (v) => set(() => ({ gender: v })),
    setCharacterName: (v) => set(() => ({ characterName: v })),
    setSelectedClass: (v) => set(() => ({ selectedClass: v })),
  })
);
