import { auth } from "@/firebase";
import styles from "./style.module.scss";
import { useMainStore } from "@/store/main";
import { When } from "../When";
import { GoogleLoginButton } from "../GoogeLoginButton";

export function Header() {
  const store = useMainStore();
  return (
    <div className={styles.container}>
      <When value={store.loggedUserInfo.loggedIn}>
        <button onClick={() => auth.signOut()}>Sign out</button>
      </When>
      <When value={!store.loggedUserInfo.loggedIn}>
        <GoogleLoginButton />
      </When>
    </div>
  );
}
