import { Outlet } from "react-router-dom";
import styles from "./style.module.scss";

export function LimitedSizeLayout() {
  return (
    <div className={styles.container}>
      <h1>Limited Size layer</h1>
      <Outlet />
    </div>
  );
}
