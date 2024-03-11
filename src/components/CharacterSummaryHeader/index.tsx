import styles from "./style.module.scss";
import { useQueryClient } from "@tanstack/react-query";
import { Query } from "@/store/query";
import { CharacterHead } from "../CharacterInfo";
import { Silver } from "../Silver";
import { When } from "../When";
import { useMainStore } from "@/store/main";
import { Button } from "../Button";
import { useModalStore } from "@/store/modal";
import { Settings } from "@/assets/Settings";

export function CharacterSummaryHeader() {
  const store = useMainStore();
  const modalStore = useModalStore();
  const queryClient = useQueryClient();
  const userChatacter = queryClient.getQueryState<User>([Query.USER_CHARACTER]);

  if (!userChatacter?.data) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.characterInfo}>
        <div className={styles.nameContainer}>
          <CharacterHead
            gender={userChatacter?.data?.appearance?.gender ?? "female"}
            head={userChatacter?.data?.appearance?.head ?? ""}
          />
          <h2>{userChatacter?.data?.name}</h2>
        </div>

        <Silver amount={userChatacter?.data?.silver} />
      </div>

      <div>
        <When value={store.loggedUserInfo.loggedIn}>
          <Button
            onClick={() => {
              modalStore.setUserConfig({
                open: true,
              });
            }}
            label={<Settings />}
            theme="danger"
          />
        </When>
      </div>
    </div>
  );
}
