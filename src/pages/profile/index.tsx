import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { CharacterInfo } from "@/components/CharacterInfo";
import { api } from "@/api/service";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { When } from "@/components/When";

export function ProfilePage() {
  const navigate = useNavigate();
  const store = useMainStore();

  async function handleDelete() {
    store.setIsLoading({ application: true });
    const result = await api.deleteUser(
      store.loggedUserInfo.email,
      store.loggedUserInfo.accessToken
    );

    if (result) {
      store.setUserCharacter(undefined);
      navigate("/create");
    }
    store.setIsLoading({ application: false });
  }

  return (
    <div className={styles.container}>
      <When value={!!store.userCharacter?.name}>
        <h2>{store.userCharacter?.name}</h2>
        <span>
          Level {store.userCharacter?.level} {store.userCharacter?.classname}
        </span>
        <CharacterInfo
          costume={store.userCharacter?.appearance?.costume ?? ""}
          gender={store.userCharacter?.appearance?.gender ?? "female"}
          head={store.userCharacter?.appearance?.head ?? ""}
        />
        <Button label="Delete my char" onClick={() => handleDelete()} />
      </When>
    </div>
  );
}
