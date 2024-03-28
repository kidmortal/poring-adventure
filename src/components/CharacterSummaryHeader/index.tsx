import styles from "./style.module.scss";
import { CharacterHead } from "../CharacterInfo";
import { Silver } from "../Silver";
import { When } from "../When";
import { useMainStore } from "@/store/main";
import { Button } from "../Button";
import { useModalStore } from "@/store/modal";
import { Settings } from "@/assets/Settings";
import MailBoxButton from "../MailBoxButton";

export function CharacterSummaryHeader() {
  const store = useMainStore();
  const modalStore = useModalStore();

  if (!store.userCharacterData) {
    return <></>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.characterInfo}>
        <div className={styles.nameContainer}>
          <CharacterHead
            gender={store.userCharacterData.appearance?.gender ?? "female"}
            head={store.userCharacterData.appearance?.head ?? ""}
          />
          <h2>{store.userCharacterData.name}</h2>
        </div>

        <Silver amount={store.userCharacterData.silver} />
      </div>

      <div className={styles.buttons}>
        <MailBoxButton />
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
