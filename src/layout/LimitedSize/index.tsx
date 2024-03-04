import { Outlet } from "react-router-dom";
import styles from "./style.module.scss";
import { FloatingNavBar } from "@/components/FloatingNavBar";
import { Header } from "@/components/Header";

export function LimitedSizeLayout() {
  return (
    <div className={styles.container}>
      <div className={styles.limitedContainer}>
        <Header />
        <Outlet />
        <FloatingNavBar />
      </div>
    </div>
  );
}
