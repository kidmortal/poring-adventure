import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { CharacterInfo } from "@/components/CharacterInfo";

export function ProfilePage() {
  const { userCharacter } = useMainStore();

  return (
    <div className={styles.container}>
      <span>Name {userCharacter?.name}</span>
      <span>Email {userCharacter?.email}</span>
      <span>Class {userCharacter?.classname}</span>
      <span>Level {userCharacter?.level}</span>
      <span>Experience {userCharacter?.experience}</span>
      <CharacterInfo
        costume={userCharacter?.appearance?.costume ?? ""}
        gender={userCharacter?.appearance?.gender ?? "female"}
        head={userCharacter?.appearance?.head ?? ""}
      />
    </div>
  );
}
