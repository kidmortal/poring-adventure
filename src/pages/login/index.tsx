import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { GoogleLoginButton } from "@/components/GoogeLoginButton";
import { When } from "@/components/When";

export function LoginPage() {
  const store = useMainStore();
  return (
    <div className={styles.container}>
      <When value={!store.loggedUserInfo.loggedIn}>
        <GoogleLoginButton />
      </When>
    </div>
  );
}
