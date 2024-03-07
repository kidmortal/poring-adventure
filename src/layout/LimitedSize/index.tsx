import { Outlet } from "react-router-dom";
import styles from "./style.module.scss";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FloatingNavBar } from "@/components/FloatingNavBar";
import { When } from "@/components/When";
import { useItemMenuStore } from "@/store/itemMenu";
import { ItemMenuModal } from "@/components/ItemMenuModal";

export function LimitedSizeLayout() {
  const itemMenuStore = useItemMenuStore();
  return (
    <div className={styles.container}>
      <div className={styles.limitedContainer}>
        <ToastContainer />
        <Outlet />
        <FloatingNavBar />
        <When value={itemMenuStore.isModalOpen}>
          <ItemMenuModal
            onRequestClose={() => {
              itemMenuStore.setIsModalOpen(false);
              itemMenuStore.setSelectedItem(undefined);
            }}
            item={itemMenuStore.selectedItem}
          />
        </When>
      </div>
    </div>
  );
}
