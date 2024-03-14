import { create } from "zustand";

type Gender = "male" | "female";
interface CharacterCreationState {
  selectedProfession?: Profession;
  characterName: string;
  gender: Gender;
  setSelectedProfession: (v: Profession) => void;
  setCharacterName: (v: string) => void;
  setGender: (v: Gender) => void;
}

export const useCharacterCreationStore = create<CharacterCreationState>()(
  (set) => ({
    selectedProfession: undefined,
    characterName: "",
    gender: "male",
    setGender: (v) => set(() => ({ gender: v })),
    setCharacterName: (v) => set(() => ({ characterName: v })),
    setSelectedProfession: (v) => set(() => ({ selectedProfession: v })),
  })
);
