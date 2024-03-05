import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { When } from "@/components/When";

export function HomePage() {
  const store = useMainStore();

  return (
    <div className={styles.container}>
      <When value={!!store.loggedUserInfo}>
        <span>Access token for {store.loggedUserInfo.email}</span>
        <textarea value={store.loggedUserInfo.accessToken} readOnly />
      </When>
    </div>
  );
}
