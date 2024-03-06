import { Outlet } from "react-router-dom";
import styles from "./style.module.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FloatingNavBar } from "@/components/FloatingNavBar";

export function LimitedSizeLayout() {
  return (
    <div className={styles.container}>
      <div className={styles.limitedContainer}>
        <ToastContainer />
        <Outlet />
        <FloatingNavBar />
      </div>
    </div>
  );
}
