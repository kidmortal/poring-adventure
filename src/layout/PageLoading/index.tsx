import { Outlet } from "react-router-dom";
import styles from "./style.module.scss";

import { useMainStore } from "@/store/main";
import { When } from "@/components/When";

export function PageLoadingLayout() {
  const store = useMainStore();
  return (
    <div>
      <When value={store.isLoading}>
        <div className={styles.fullScreenOverlay}>
          <img alt="poring" src="assets/poring.gif" />
          <span>Loading...</span>
        </div>
      </When>
      <Outlet />
    </div>
  );
}
