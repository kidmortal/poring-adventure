import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { GoogleLoginButton } from "@/components/GoogeLoginButton";
import { When } from "@/components/When";
import { useNavigate } from "react-router-dom";

export function LoginPage() {
  const navigate = useNavigate();
  const store = useMainStore();

  return (
    <div className={styles.container}>
      <img src="https://kidmortal.sirv.com/misc/poring_adventure.png?q=20" />
      <When value={!store.loggedUserInfo.loggedIn}>
        <GoogleLoginButton onSuccess={() => navigate("/")} />
      </When>
    </div>
  );
}
