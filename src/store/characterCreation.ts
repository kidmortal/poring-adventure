import { api } from "@/api/service";
import { create } from "zustand";
import { useMainStore } from "./main";

type Gender = "male" | "female";
interface CharacterCreationState {
  selectedCharacterClass: string;
  characterName: string;
  gender: Gender;
  setSelectedCharacterClass: (v: string) => void;
  setCharacterName: (v: string) => void;
  setGender: (v: Gender) => void;
  createCharacter: () => Promise<boolean>;
}

export const useCharacterCreationStore = create<CharacterCreationState>()(
  (set, get) => ({
    selectedCharacterClass: "knight",
    characterName: "",
    gender: "male",
    createCharacter: async () => {
      try {
        const mainStore = useMainStore.getState();
        const state = get();
        const newUser = await api.createNewUser(
          {
            name: state.characterName,
            email: mainStore.loggedUserInfo.email,
            gender: state.gender,
            classname: state.selectedCharacterClass,
          },
          mainStore.loggedUserInfo.accessToken
        );
        mainStore.setUserCharacter(newUser);
        return true;
      } catch (error) {
        console.log("an error occured creating character");
        return false;
      }
    },
    setGender: (v) => set(() => ({ gender: v })),
    setCharacterName: (v) => set(() => ({ characterName: v })),
    setSelectedCharacterClass: (v) =>
      set(() => ({ selectedCharacterClass: v })),
  })
);
