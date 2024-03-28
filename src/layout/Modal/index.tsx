import { Outlet } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";

import { useModalStore } from "@/store/modal";
import { UserSettingsModal } from "@/layout/Modal/Modals/UserSettingsModal";
import { ItemMenuModal } from "@/layout/Modal/Modals/ItemMenuModal";
import { SellItemModal } from "@/layout/Modal/Modals/SellItemModal";
import { BuyItemModal } from "@/layout/Modal/Modals/BuyItemModal";
import { PartyInfoModal } from "@/layout/Modal/Modals/PartyInfoModal";
import { FriendListModal } from "@/layout/Modal/Modals/FriendListModal";
import { InteractUserModal } from "@/layout/Modal/Modals/InteractUserModal";
import { SkillbookModal } from "@/layout/Modal/Modals/SkillbookModal";
import { UserEditCharacterModal } from "./Modals/UserEditCharacterModal";
import { DeleteCharConfirmationModal } from "./Modals/DeleteCharConfirmation";
import { useMainStore } from "@/store/main";
import { MailBoxModal } from "./Modals/MailBoxModal";
import { GuildInfoModal } from "./Modals/GuildInfoModal";

export function ModalLayout() {
  const mainStore = useMainStore();
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
        party={modalStore.partyInfo.party}
      />
      <FriendListModal
        onRequestClose={() => modalStore.setFriendlist({ open: false })}
        isOpen={modalStore.friendlist.open}
      />
      <InteractUserModal
        onRequestClose={() => modalStore.setInteractUser({ open: false })}
        isOpen={modalStore.interactUser.open}
        user={modalStore.interactUser.user}
      />
      <UserEditCharacterModal
        onRequestClose={() => modalStore.setEditCharacter({ open: false })}
        isOpen={modalStore.editCharacter.open}
      />
      <SkillbookModal
        onRequestClose={() => modalStore.setSkillbook({ open: false })}
        isOpen={modalStore.skillbook.open}
      />
      <MailBoxModal
        onRequestClose={() => modalStore.setMailBox({ open: false })}
        isOpen={modalStore.mailBox.open}
        mailBox={mainStore.mailBox}
      />
      <GuildInfoModal
        onRequestClose={() => modalStore.setGuildInfo({ open: false })}
        isOpen={modalStore.guildInfo.open}
        guild={modalStore.guildInfo.guild}
      />
      <DeleteCharConfirmationModal
        onRequestClose={() =>
          modalStore.setConfirmDeleteCharacter({ open: false })
        }
        isOpen={modalStore.confirmDeleteCharacter.open}
      />
    </>
  );
}
