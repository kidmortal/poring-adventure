import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import styles from "./style.module.scss";
import { auth } from "../../firebase";

export function GoogleLoginButton() {
  function handleClick() {
    const provider = new GoogleAuthProvider();
    provider.addScope("profile");
    provider.addScope("email");
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        console.log(token);
        // The signed-in user info.
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
    <div className={styles.container} onClick={() => handleClick()}>
      GoogleLoginButton
    </div>
  );
}
