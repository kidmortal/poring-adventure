import { Outlet } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';

import { useModalStore } from '@/store/modal';
import { UserSettingsModal } from '@/modals/UserSettingsModal';
import { ItemMenuModal } from '@/modals/ItemMenuModal';
import { SellItemModal } from '@/modals/SellItemModal';
import { BuyItemModal } from '@/modals/BuyItemModal';
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
import { EnhanceItemModal } from '@/modals/EnhanceItemModal';
import { SwapProfessionModal } from '@/modals/SwapProfessionModal';
import { MonsterInfoModal } from '@/modals/MonsterInfoModal';
import { ItemInfoModal } from '@/modals/ItemInfoModal';
import { CraftDetailsModal } from '@/modals/CraftDetailsModal';
import { GiftModal } from '@/modals/GiftModal';
import { PartyMemberModal } from '@/modals/PartyMemberModal';

export function ModalLayout() {
  const userStore = useUserStore();
  const modalStore = useModalStore();
  return (
    <>
      <Outlet />
      <ItemMenuModal
        onRequestClose={() => modalStore.setInventoryItem({ open: false })}
        isOpen={modalStore.inventoryItem.open}
        inventoryItem={modalStore.inventoryItem.selectedItem}
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
      <EnhanceItemModal
        onRequestClose={() => modalStore.setEnhanceItem({ open: false })}
        isOpen={modalStore.enhanceItem.open}
        inventoryItem={modalStore.inventoryItem.selectedItem}
      />
      <MonsterInfoModal
        onRequestClose={() => modalStore.setMonsterInfo({ open: false })}
        isOpen={modalStore.monsterInfo.open}
        monster={modalStore.monsterInfo.monster}
      />
      <ItemInfoModal
        onRequestClose={() => modalStore.setItemInfo({ open: false })}
        isOpen={modalStore.itemInfo.open}
        item={modalStore.itemInfo.item}
      />
      <PartyMemberModal
        onRequestClose={() => modalStore.setPartyMember({ open: false })}
        isOpen={modalStore.partyMember.open}
        member={modalStore.partyMember.member}
      />
      <GiftModal
        onRequestClose={() => modalStore.setGift({ open: false })}
        isOpen={modalStore.gift.open}
        user={modalStore.gift.user}
      />
      <CraftDetailsModal
        onRequestClose={() => modalStore.setCraftDetails({ open: false })}
        isOpen={modalStore.craftDetails.open}
        recipe={modalStore.craftDetails.recipe}
        offer={modalStore.craftDetails.offer}
      />
      <SwapProfessionModal
        onRequestClose={() => modalStore.setSwapProfession({ open: false })}
        isOpen={modalStore.swapProfession.open}
        profession={modalStore.swapProfession.profession}
      />
    </>
  );
}
