import styles from "./style.module.scss";

import { GoogleIcon } from "../../assets/Google";
import { PlataformAuth } from "@/auth";
import { useMainStore } from "@/store/main";

type Props = {
  onSuccess: () => void;
};

export function GoogleLoginButton(props: Props) {
  const store = useMainStore();
  return (
    <button
      className={styles.container}
      onClick={() =>
        PlataformAuth.SignInWithGoogle({
          onSuccess: (info) => {
            store.setUserLoggedInfo({
              accessToken: info.accessToken,
              email: info.email,
              loggedIn: true,
            });
            props.onSuccess();
          },
        })
      }
    >
      <GoogleIcon size={24} />
      <span>Login with Google</span>
    </button>
  );
}
