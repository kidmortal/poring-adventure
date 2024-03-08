import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { useModalStore } from "@/store/modal";
import { UserSettingsModal } from "@/components/Modals/UserSettingsModal";
import { ItemMenuModal } from "@/components/Modals/ItemMenuModal";
import { SellItemModal } from "@/components/Modals/SellItemModal";

export function ModalLayout() {
  const modalStore = useModalStore();
  return (
    <>
      <Outlet />
      <ItemMenuModal
        onRequestClose={() =>
          modalStore.setInventoryItem({
            open: false,
          })
        }
        isOpen={modalStore.inventoryItem.open}
        item={modalStore.inventoryItem.selectedItem}
      />
      <SellItemModal
        onRequestClose={() =>
          modalStore.setSellItem({
            open: false,
          })
        }
        isOpen={modalStore.sellItem.open}
        item={modalStore.inventoryItem.selectedItem}
      />
      <UserSettingsModal
        isOpen={modalStore.userConfig.open}
        onRequestClose={() =>
          modalStore.setUserConfig({
            open: false,
          })
        }
      />
    </>
  );
}
