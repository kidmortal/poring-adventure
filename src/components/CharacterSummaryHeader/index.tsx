import styles from "./style.module.scss";
import { useQueryClient } from "@tanstack/react-query";
import { Query } from "@/store/query";
import { CharacterHead } from "../CharacterInfo";
import { Silver } from "../Silver";
import { When } from "../When";
import { useMainStore } from "@/store/main";
import { auth } from "@/firebase";
import { Button } from "../Button";

export function CharacterSummaryHeader() {
  const store = useMainStore();
  const queryClient = useQueryClient();
  const userChatacter = queryClient.getQueryState<User>([Query.USER_CHARACTER]);

  if (!userChatacter?.data) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.characterInfo}>
        <CharacterHead
          gender={userChatacter?.data?.appearance?.gender ?? "female"}
          head={userChatacter?.data?.appearance?.head ?? ""}
        />
        <h2>{userChatacter?.data?.name}</h2>
        <Silver amount={userChatacter?.data?.silver} />
      </div>

      <div>
        <When value={store.loggedUserInfo.loggedIn}>
          <Button
            onClick={() => auth.signOut()}
            label="Sign out"
            theme="error"
          />
        </When>
      </div>
    </div>
  );
}
