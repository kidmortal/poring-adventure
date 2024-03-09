import { Outlet } from "react-router-dom";
import styles from "./style.module.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export function LimitedSizeLayout() {
  return (
    <div className={styles.container}>
      <div className={styles.limitedContainer}>
        <ToastContainer />
        <Outlet />
      </div>
    </div>
  );
}
