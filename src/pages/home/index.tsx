import { auth } from "../../firebase";

export function HomePage() {
  return (
    <div>
      <span>HomePage</span>
      <button onClick={() => auth.signOut()}>Quitar</button>
    </div>
  );
}
