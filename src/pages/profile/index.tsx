import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { CharacterInfo } from "@/components/CharacterInfo";
import { api } from "@/api/service";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/Button";
import { When } from "@/components/When";
import { useQueryClient } from "@tanstack/react-query";
import { Query } from "@/store/query";

export function ProfilePage() {
  const navigate = useNavigate();
  const store = useMainStore();
  const queryClient = useQueryClient();
  const userChatacter = queryClient.getQueryData<User>([Query.USER_CHARACTER]);

  async function handleDelete() {
    store.setIsLoading(true);
    const result = await api.deleteUser(
      store.loggedUserInfo.email,
      store.loggedUserInfo.accessToken
    );

    if (result) {
      queryClient.invalidateQueries({ queryKey: [Query.USER_CHARACTER] });
      navigate("/create");
    }
    store.setIsLoading(false);
  }

  return (
    <div className={styles.container}>
      <When value={!!userChatacter?.name}>
        <h2>{userChatacter?.name}</h2>
        <span>
          Level {userChatacter?.level} {userChatacter?.classname}
        </span>
        <CharacterInfo
          costume={userChatacter?.appearance?.costume ?? ""}
          gender={userChatacter?.appearance?.gender ?? "female"}
          head={userChatacter?.appearance?.head ?? ""}
        />
        <Button label="Delete my char" onClick={() => handleDelete()} />
      </When>
    </div>
  );
}
