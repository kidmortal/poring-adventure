import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import styles from "./style.module.scss";
import { auth } from "../../firebase";
import { GoogleIcon } from "../../assets/Google";

export function GoogleLoginButton() {
  function handleClick() {
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
      })
      .catch((error) => {
        console.log(error);
        // The email of the user's account used.
        const email = error.customData.email;
        console.log(email);
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.log(credential);
        // ...
      });
  }

  return (
    <button className={styles.container} onClick={() => handleClick()}>
      <GoogleIcon size={24} />
      <span>Login with Google</span>
    </button>
  );
}
