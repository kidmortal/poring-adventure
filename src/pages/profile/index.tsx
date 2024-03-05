import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { CharacterInfo } from "@/components/CharacterInfo";
import { api } from "@/api/service";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const navigate = useNavigate();
  const { userCharacter, loggedUserInfo, setUserCharacter } = useMainStore();

  async function handleDelete() {
    const result = await api.deleteUser(
      loggedUserInfo.email,
      loggedUserInfo.accessToken
    );

    if (result) {
      setUserCharacter(undefined);
      navigate("/create");
    }
  }

  return (
    <div className={styles.container}>
      <span>Name {userCharacter?.name}</span>
      <span>
        Level {userCharacter?.level} {userCharacter?.classname}
      </span>
      <CharacterInfo
        costume={userCharacter?.appearance?.costume ?? ""}
        gender={userCharacter?.appearance?.gender ?? "female"}
        head={userCharacter?.appearance?.head ?? ""}
      />
      <button onClick={() => handleDelete()}>Delete my char</button>
    </div>
  );
}
