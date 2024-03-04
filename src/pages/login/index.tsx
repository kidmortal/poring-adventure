import { GoogleLoginButton } from "../../components/GoogeLoginButton";
import { useMainStore } from "../../store/main";

export function LoginPage() {
  const store = useMainStore();
  return (
    <div>
      <h1>user is {store.userLoggedIn ? "Logged" : "Outsider"}</h1>
      <GoogleLoginButton />
    </div>
  );
}
