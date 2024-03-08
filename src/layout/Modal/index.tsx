import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { When } from "@/components/When";
import { ItemMenuModal } from "@/components/ItemMenuModal";
import { useModalStore } from "@/store/modal";
import { UserSettingsModal } from "@/components/Modals/UserSettingsModal";

export function ModalLayout() {
  const modalStore = useModalStore();
  return (
    <>
      <Outlet />
      <When value={modalStore.inventoryItem.open}>
        <ItemMenuModal
          onRequestClose={() => {
            modalStore.setInventoryItem({
              open: false,
              selectedItem: undefined,
            });
          }}
          item={modalStore.inventoryItem.selectedItem}
        />
      </When>
      <When value={modalStore.userConfig.open}>
        <UserSettingsModal
          onRequestClose={() => {
            modalStore.setUserConfig({
              open: false,
            });
          }}
        />
      </When>
    </>
  );
}
