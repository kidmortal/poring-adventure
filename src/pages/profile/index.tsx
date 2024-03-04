import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { useEffect } from "react";

export function ProfilePage() {
  const store = useMainStore();

  useEffect(() => {
    if (store.loggedUserInfo.email) {
      store.fetchUserCharacter();
    }
  }, [store.loggedUserInfo.email]);

  return (
    <div className={styles.container}>
      <span>Name {store.userCharacter?.name}</span>
      <span>Email {store.userCharacter?.email}</span>
      <span>Class {store.userCharacter?.classname}</span>
      <span>Level {store.userCharacter?.level}</span>
      <span>Experience {store.userCharacter?.experience}</span>
    </div>
  );
}
