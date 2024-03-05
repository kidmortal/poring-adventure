import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const navigate = useNavigate();
  const store = useMainStore();

  useEffect(() => {
    if (store.loggedUserInfo.email) {
      store.fetchUserCharacter().then((success) => {
        if (!success) {
          navigate("/create");
        }
      });
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
