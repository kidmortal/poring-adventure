import { Outlet } from "react-router-dom";
import styles from "./style.module.scss";

import { useMainStore } from "@/store/main";
import { When } from "@/components/When";
import { FullscreenLoading } from "@/components/FullscreenLoading";

export function PageLoadingLayout() {
  const store = useMainStore();
  return (
    <>
      <When value={store.isLoading}>
        <div className={styles.coverBackground} />
        <FullscreenLoading />
      </When>
      <Outlet />
    </>
  );
}
