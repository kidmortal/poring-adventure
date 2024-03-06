import { useCharacterCreationStore } from "@/store/characterCreation";
import styles from "./style.module.scss";
import cn from "classnames";
import { Button } from "@/components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/service";
import { useMainStore } from "@/store/main";
import { Query } from "@/store/query";

const headScrMap: { [name: string]: { female: string; male: string } } = {
  head_1: {
    male: "assets/head_1_male.png",
    female: "assets/head_1_female.png",
  },
};

const bodySrcMap: { [name: string]: string } = {
  acolyte: "assets/acolyte.png",
  mage: "assets/mage.png",
  assassin: "assets/assassin.png",
  knight: "assets/knight.png",
};

function Character({
  name,
  gender,
  head,
}: {
  name: string;
  head: string;
  gender: "male" | "female";
}) {
  return (
    <div className={styles.characterContainer}>
      <span>{name}</span>
      <div className={cn(styles.character)}>
        <img className={styles.head} src={headScrMap[head]?.[gender]} />
        <img className={styles.body} src={bodySrcMap[name]} />
      </div>
    </div>
  );
}

function CharacterPicker() {
  const store = useCharacterCreationStore();

  return (
    <div className={styles.container}>
      <h1>Create Your Character</h1>
      <div className={styles.classList}>
        <Character
          name={store.selectedCharacterClass}
          gender={store.gender}
          head="head_1"
        />
      </div>
      <div className={styles.characterCreationOptions}>
        <div>
          <div>
            <input
              type="radio"
              id="acolyte"
              name="acolyte"
              value="acolyte"
              onChange={() => store.setSelectedCharacterClass("acolyte")}
              checked={store.selectedCharacterClass === "acolyte"}
            />
            <label htmlFor="acolyte">acolyte</label>
          </div>
          <div>
            <input
              type="radio"
              id="knight"
              name="knight"
              value="knight"
              onChange={() => store.setSelectedCharacterClass("knight")}
              checked={store.selectedCharacterClass === "knight"}
            />
            <label htmlFor="knight">knight</label>
          </div>
          <div>
            <input
              type="radio"
              id="mage"
              name="mage"
              value="mage"
              onChange={() => store.setSelectedCharacterClass("mage")}
              checked={store.selectedCharacterClass === "mage"}
            />
            <label htmlFor="mage">mage</label>
          </div>
          <div>
            <input
              type="radio"
              id="assassin"
              name="assassin"
              value="assassin"
              onChange={() => store.setSelectedCharacterClass("assassin")}
              checked={store.selectedCharacterClass === "assassin"}
            />
            <label htmlFor="assassin">assassin</label>
          </div>
        </div>
        <div>
          <div>
            <input
              type="radio"
              id="male"
              name="male"
              value="male"
              onChange={() => store.setGender("male")}
              checked={store.gender === "male"}
            />
            <label htmlFor="male">male</label>
          </div>
          <div>
            <input
              type="radio"
              id="female"
              name="female"
              value="female"
              onChange={() => store.setGender("female")}
              checked={store.gender === "female"}
            />
            <label htmlFor="female">female</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CharacterCreationPage() {
  const queryClient = useQueryClient();
  const store = useCharacterCreationStore();
  const { loggedUserInfo } = useMainStore();

  const newUserData = {
    email: loggedUserInfo.email,
    name: store.characterName,
    classname: store.selectedCharacterClass,
    gender: store.gender,
  };

  const newCharacterMutation = useMutation({
    mutationFn: () =>
      api.createNewUser(newUserData, loggedUserInfo.accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.USER_CHARACTER] });
    },
  });

  return (
    <div className={styles.container}>
      <input
        placeholder="Character name"
        onChange={(e) => store.setCharacterName(e.target.value)}
      />
      <CharacterPicker />
      <Button
        label="Create Character"
        onClick={() => newCharacterMutation.mutate()}
      />
    </div>
  );
}
