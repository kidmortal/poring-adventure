import { Capacitor } from "@capacitor/core";
import { FirebaseAuthentication } from "@capacitor-firebase/authentication";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/firebase";

type Args = {
  onSuccess: (info: { accessToken: string; email: string }) => void;
};

function SignInWithGoogle(args: Args) {
  if (Capacitor.getPlatform() === "android") {
    FirebaseAuthentication.signInWithGoogle()
      .then(({ user }) => {
        if (user?.email) {
          FirebaseAuthentication.getIdToken().then((token) => {
            args.onSuccess({
              accessToken: token.token,
              email: user.email ?? "",
            });
          });
        }
      })
      .catch((e) => alert(e));
    return;
  }
  if (Capacitor.getPlatform() === "web") {
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
}

async function SignOut(args: { onSuccess: () => void }) {
  if (Capacitor.getPlatform() === "android") {
    await FirebaseAuthentication.signOut();
    args.onSuccess();
  }
  if (Capacitor.getPlatform() === "web") {
    await auth.signOut();
    args.onSuccess();
  }
}

export const PlataformAuth = {
  SignInWithGoogle,
  SignOut,
};
