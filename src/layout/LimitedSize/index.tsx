import { Outlet } from "react-router-dom";
import styles from "./style.module.scss";
import { Capacitor } from "@capacitor/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cn from "classnames";
import { useEffect } from "react";
import { Updater } from "@/updater";

export function LimitedSizeLayout() {
  const plataform = Capacitor.getPlatform();

  async function verifyAppVersion() {
    const currentVersion = await Updater.getCurrentAppVersion();
    const availableVersion = await Updater.getAvailableAppVersion();

    if (currentVersion !== availableVersion) {
      alert("New version availabe");
      Updater.openAppStore();
    }
  }

  useEffect(() => {
    verifyAppVersion();
  }, []);

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
