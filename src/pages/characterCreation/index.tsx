import { useCharacterCreationStore } from "@/store/characterCreation";
import styles from "./style.module.scss";
import { Button } from "@/components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/service";
import { useMainStore } from "@/store/main";
import { Query } from "@/store/query";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { CharacterInfo } from "@/components/CharacterInfo";

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
      <CharacterInfo gender={gender} head={head} costume={name} />
    </div>
  );
}

function ClassRadioSelectors() {
  const store = useCharacterCreationStore();
  return (
    <div className={styles.row}>
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
  );
}
function GenderRadioSelectors() {
  const store = useCharacterCreationStore();
  return (
    <div className={styles.row}>
      <span>{`Gender =>`} </span>
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
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [Query.USER_CHARACTER] }),
  });

  if (newCharacterMutation.isPending) {
    return <FullscreenLoading />;
  }

  return (
    <div className={styles.container}>
      <h1>Create your character</h1>
      <input
        placeholder="Character name"
        onChange={(e) => store.setCharacterName(e.target.value)}
      />
      <div className={styles.container}>
        <Character
          name={store.selectedCharacterClass}
          gender={store.gender}
          head="head_1"
        />

        <ClassRadioSelectors />
        <GenderRadioSelectors />
        <Button
          label="Create Character"
          onClick={() => newCharacterMutation.mutate()}
        />
      </div>
    </div>
  );
}
