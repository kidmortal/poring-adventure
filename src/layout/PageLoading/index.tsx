import { Outlet } from "react-router-dom";
import styles from "./style.module.scss";

import { useMainStore } from "@/store/main";

export function PageLoadingLayout() {
  const store = useMainStore();

  if (store.isLoading.application) {
    return (
      <div className={styles.container}>
        <img alt="poring" src="assets/poring.gif" />
        <span>Loading...</span>
      </div>
    );
  }

  return <Outlet />;
}
