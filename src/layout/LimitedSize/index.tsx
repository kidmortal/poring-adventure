import { Outlet } from "react-router-dom";
import styles from "./style.module.scss";
import { Capacitor } from "@capacitor/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cn from "classnames";
import { useEffect, useState } from "react";
import { Updater } from "@/config/updater";
import { UpdateAvailableMessage } from "@/components/UpdateAvailableMessage";
import { When } from "@/components/When";

export function LimitedSizeLayout() {
  const [isOudated, setIsOudated] = useState(false);
  const plataform = Capacitor.getPlatform();

  async function verifyAppVersion() {
    const currentVersion = await Updater.getCurrentAppVersion();
    const availableVersion = await Updater.getAvailableAppVersion();

    if (currentVersion !== availableVersion) {
      setIsOudated(true);
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
        <When value={isOudated}>
          <UpdateAvailableMessage />
        </When>
        <When value={!isOudated}>
          <Outlet />
        </When>
      </div>
    </div>
  );
}
