import styles from './style.module.scss';

import { useMutation } from '@tanstack/react-query';
import { FaUserPlus } from 'react-icons/fa';

import { BaseModal } from '../BaseModal';
import { CharacterInfo } from '@/components/Character/CharacterInfo';
import { Stat } from '@/components/Character/CharacterStatsInfo';
import { InventoryItem } from '@/components/Items/InventoryItem';
import { Button } from '@/components/shared/Button';
import ForEach from '@/components/shared/ForEach';
import { When } from '@/components/shared/When';
import { Silver } from '@/components/StatsComponents/Silver';
import { useWebsocketApi } from '@/api/websocketServer';
import { useUserStore } from '@/store/user';

type Props = {
  isOpen?: boolean;
  user?: User;
  onRequestClose: (i?: InventoryItem) => void;
};

/**
 * Another player's profile: who they are, what they practice and what they are
 * wearing. Everything shown here already rides along on the ranking payload, so
 * opening it costs no request.
 */
export function InteractUserModal(props: Props) {
  const userStore = useUserStore();
  const api = useWebsocketApi();

  const inviteUserMutation = useMutation({
    mutationFn: (email: string) =>
      api.party.inviteToParty({ invitedEmail: email, partyId: userStore.user?.partyId ?? 0 }),
    onSuccess: () => {
      props.onRequestClose();
    },
  });

  const user = props.user;
  const stats = user?.stats;
  const profession = user?.professions?.[0];
  const equipped = (user?.inventory ?? []).filter((item) => item.equipped);

  const isSelf = user?.email === userStore.user?.email;
  const hasParty = !!userStore.user?.partyId;

  let inviteBlockedReason: string | undefined;
  if (isSelf) inviteBlockedReason = 'This is you';
  else if (!hasParty) inviteBlockedReason = 'Create a party first';

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <header className={styles.header}>
        <div className={styles.portrait}>
          <CharacterInfo
            costume={user?.appearance?.costume ?? ''}
            gender={user?.appearance?.gender ?? 'female'}
            head={user?.appearance?.head ?? ''}
          />
        </div>
        <div className={styles.identity}>
          <h2 className={styles.name}>{user?.name}</h2>
          <span className={styles.className}>
            {user?.class?.name ?? 'No class'} · Lv {stats?.level ?? 1}
          </span>
          <When value={!!profession}>
            <span className={styles.profession}>
              <span className={styles.professionIcon}>{profession?.profession?.icon}</span>
              {profession?.profession?.name} · Lv {profession?.level}
            </span>
          </When>
          <Silver amount={user?.silver} />
        </div>
      </header>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Stats</span>
        <div className={styles.stats}>
          <Stat assetName="health" label="HP" value={stats?.maxHealth} />
          <Stat assetName="mana" label="MP" value={stats?.maxMana} />
          <Stat assetName="attack" label="ATK" value={stats?.attack} />
          <Stat assetName="str" label="STR" value={stats?.str} />
          <Stat assetName="agi" label="AGI" value={stats?.agi} />
          <Stat assetName="int" label="INT" value={stats?.int} />
        </div>
      </section>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>Equipped</span>
        <When value={equipped.length === 0}>
          <span className={styles.empty}>Wearing nothing at all</span>
        </When>
        <div className={styles.gear}>
          <ForEach
            items={equipped}
            render={(item) => (
              // Display only: this gear belongs to someone else, so it opens no
              // menu of things to do with it.
              <InventoryItem key={item.id} inventoryItem={item} customSize={42} />
            )}
          />
        </div>
      </section>

      <Button
        className={styles.inviteButton}
        label={
          <span className={styles.inviteLabel}>
            <FaUserPlus />
            {inviteBlockedReason ?? 'Invite to party'}
          </span>
        }
        theme={inviteBlockedReason ? 'neutral' : 'primary'}
        disabled={!!inviteBlockedReason || inviteUserMutation.isPending}
        onClick={() => {
          if (user?.email) {
            inviteUserMutation.mutate(user.email);
          }
        }}
      />
    </BaseModal>
  );
}
