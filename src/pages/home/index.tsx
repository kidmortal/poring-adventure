import { auth } from "@/firebase";
import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";

export function HomePage() {
  const store = useMainStore();
  return (
    <div className={styles.container}>
      <span>Access token for {store.loggedUserInfo.email}</span>
      <textarea value={store.loggedUserInfo.accessToken} />
      <button onClick={() => auth.signOut()}>Quitar</button>
    </div>
  );
}
