import { useEffect, useState } from "react";

import styles from "./style.module.scss";
import { api } from "./api/service";

function App() {
  const [user, setUser] = useState<User | undefined>();

  useEffect(() => {
    api.getUserInfo("kidmortal@gmail.com").then((u) => setUser(u));
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.userData}>
        <span>Name {user?.name}</span>
        <span>Email {user?.email}</span>
        <span>Class {user?.classname}</span>
        <span>Level {user?.level}</span>
        <span>Experience {user?.experience}</span>
      </div>
    </div>
  );
}

export default App;
