import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import { useModalStore } from '@/store/modal';
import { UserSettingsModal } from '@/modals/UserSettingsModal';
import { ItemMenuModal } from '@/modals/ItemMenuModal';
import { SellItemModal } from '@/modals/SellItemModal';
import { BuyItemModal } from '@/modals/BuyItemModal';
import { PartyInfoModal } from '@/modals/PartyInfoModal';
import { FriendListModal } from '@/modals/FriendListModal';
import { InteractUserModal } from '@/modals/InteractUserModal';
import { SkillbookModal } from '@/modals/SkillbookModal';
import { UserEditCharacterModal } from '@/modals/UserEditCharacterModal';
import { DeleteCharConfirmationModal } from '@/modals/DeleteCharConfirmation';
import { MailBoxModal } from '@/modals/MailBoxModal';
import { GuildInfoModal } from '@/modals/GuildInfoModal';
import { GuildTaskSelectModal } from '@/modals/GuildTaskSelectModal';
import { useUserStore } from '@/store/user';
import { GuildBlessingModal } from '@/modals/GuildBlessingModal';
import { DiscordIntegrationModal } from '@/modals/DiscordIntegrationModal';

export function ModalLayout() {
  const userStore = useUserStore();
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
        mailBox={userStore.mailBox}
      />
      <GuildInfoModal
        onRequestClose={() => modalStore.setGuildInfo({ open: false })}
        isOpen={modalStore.guildInfo.open}
        guild={modalStore.guildInfo.guild}
      />
      <GuildTaskSelectModal
        onRequestClose={() => modalStore.setGuildTaskSelect({ open: false })}
        isOpen={modalStore.guildTaskSelect.open}
      />
      <GuildBlessingModal
        onRequestClose={() => modalStore.setGuildBlessing({ open: false })}
        isOpen={modalStore.guildBlessing.open}
      />
      <DiscordIntegrationModal
        onRequestClose={() => modalStore.setDiscordIntegration({ open: false })}
        isOpen={modalStore.discordIntegration.open}
      />
      <DeleteCharConfirmationModal
        onRequestClose={() => modalStore.setConfirmDeleteCharacter({ open: false })}
        isOpen={modalStore.confirmDeleteCharacter.open}
      />
    </>
  );
}
