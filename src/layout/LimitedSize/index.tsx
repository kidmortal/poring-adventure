import { Outlet } from "react-router-dom";
import { ScreenOrientation } from "@capacitor/screen-orientation";
import styles from "./style.module.scss";
import { Capacitor } from "@capacitor/core";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import cn from "classnames";
import { useEffect, useState } from "react";
import { Updater } from "@/config/updater";
import { UpdateAvailableMessageScreen } from "@/screens/UpdateAvailableMessage";
import { When } from "@/components/When";
import { useAdminStore } from "@/store/admin";

export function LimitedSizeLayout() {
  const adminStore = useAdminStore();
  const [isOudated, setIsOudated] = useState(false);
  const plataform = Capacitor.getPlatform();

  async function verifyAppVersion() {
    try {
      const currentVersion = await Updater.getCurrentAppVersion();
      const availableVersion = await Updater.getAvailableAppVersion();
      adminStore.setNativeServices({ updater: true });
      if (currentVersion !== availableVersion) {
        setIsOudated(true);
      }
    } catch (error) {
      adminStore.setNativeServices({ updater: false });
      console.log("cant update");
    }
  }

  async function lockScreenToPortrait() {
    try {
      await ScreenOrientation.lock({ orientation: "portrait" });
      adminStore.setNativeServices({ lockPortrait: true });
    } catch (error) {
      adminStore.setNativeServices({ lockPortrait: false });
    }
  }

  useEffect(() => {
    if (plataform === "android") {
      verifyAppVersion();
      lockScreenToPortrait();
    }
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
          <UpdateAvailableMessageScreen
            onCancelUpdate={() => setIsOudated(false)}
          />
        </When>
        <When value={!isOudated}>
          <Outlet />
        </When>
      </div>
    </div>
  );
}
