import { Outlet } from "react-router-dom";
import styles from "./style.module.scss";
import { Capacitor } from "@capacitor/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cn from "classnames";

export function LimitedSizeLayout() {
  const plataform = Capacitor.getPlatform();

  return (
    <div className={styles.container}>
      <div
        className={cn(styles.limitedContainer, {
          [styles.limitedDev]: import.meta.env.DEV && import.meta.env.VITE_DEV,
          [styles.limitSize]: plataform === "web",
        })}
      >
        <ToastContainer />
        <Outlet />
      </div>
    </div>
  );
}
