import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { useModalStore } from "@/store/modal";
import { UserSettingsModal } from "@/components/Modals/UserSettingsModal";
import { ItemMenuModal } from "@/components/Modals/ItemMenuModal";
import { SellItemModal } from "@/components/Modals/SellItemModal";
import { BuyItemModal } from "@/components/Modals/BuyItemModal";
import { PartyInfoModal } from "@/components/Modals/PartyInfoModal";
import { FriendListModal } from "@/components/Modals/FriendListModal";

export function ModalLayout() {
  const modalStore = useModalStore();
  return (
    <>
      <Outlet />
      <ItemMenuModal
        onRequestClose={() => modalStore.setInventoryItem({ open: false })}
        isOpen={modalStore.inventoryItem.open}
        item={modalStore.inventoryItem.selectedItem}
      />
      <SellItemModal
        onRequestClose={() => modalStore.setSellItem({ open: false })}
        isOpen={modalStore.sellItem.open}
        item={modalStore.inventoryItem.selectedItem}
      />
      <BuyItemModal
        onRequestClose={() => modalStore.setBuyItem({ open: false })}
        isOpen={modalStore.buyItem.open}
        item={modalStore.buyItem.marketListing}
      />
      <UserSettingsModal
        onRequestClose={() => modalStore.setUserConfig({ open: false })}
        isOpen={modalStore.userConfig.open}
      />
      <PartyInfoModal
        onRequestClose={() => modalStore.setPartyInfo({ open: false })}
        isOpen={modalStore.partyInfo.open}
      />
      <FriendListModal
        onRequestClose={() => modalStore.setFriendlist({ open: false })}
        isOpen={modalStore.friendlist.open}
      />
    </>
  );
}
