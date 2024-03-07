import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { When } from "@/components/When";
import { useItemMenuStore } from "@/store/itemMenu";
import { ItemMenuModal } from "@/components/ItemMenuModal";

export function ModalLayout() {
  const itemMenuStore = useItemMenuStore();
  return (
    <>
      <Outlet />
      <When value={itemMenuStore.isModalOpen}>
        <ItemMenuModal
          onRequestClose={() => {
            itemMenuStore.setIsModalOpen(false);
            itemMenuStore.setSelectedItem(undefined);
          }}
          item={itemMenuStore.selectedItem}
        />
      </When>
    </>
  );
}
