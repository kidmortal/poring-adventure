import { auth } from "@/firebase";
import styles from "./style.module.scss";
import { useMainStore } from "@/store/main";
import { When } from "../When";
import { GoogleLoginButton } from "../GoogeLoginButton";
import { Query } from "@/store/query";
import { useQueryClient } from "@tanstack/react-query";
import { CharacterHead } from "../CharacterInfo";

export function Header() {
  const store = useMainStore();
  const queryClient = useQueryClient();
  const userChatacter = queryClient.getQueryData<User>([Query.USER_CHARACTER]);

  return (
    <div className={styles.container}>
      <div className={styles.characterInfo}>
        <CharacterHead
          gender={userChatacter?.appearance.gender ?? "female"}
          head={userChatacter?.appearance.head ?? ""}
        />
        <span>{userChatacter?.name}</span>
        <span>{userChatacter?.silver}</span>
        <img src="https://cdn.discordapp.com/emojis/651562374326779955.webp?size=96&quality=lossless" />
      </div>
      <div>
        <When value={store.loggedUserInfo.loggedIn}>
          <button onClick={() => auth.signOut()}>Sign out</button>
        </When>
        <When value={!store.loggedUserInfo.loggedIn}>
          <GoogleLoginButton />
        </When>
      </div>
    </div>
  );
}
