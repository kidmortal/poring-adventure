import { useWebsocketApi } from '@/api/websocketServer';
import styles from './style.module.scss';
import { useMainStore } from '@/store/main';
import { useMutation, useQuery } from '@tanstack/react-query';
import ForEach from '@/components/shared/ForEach';
import { FaCrown, FaChessPawn } from 'react-icons/fa6';
import { CharacterHead } from '@/components/Character/CharacterInfo';
import { When } from '@/components/shared/When';
import { Button } from '@/components/shared/Button';
import { useUserStore } from '@/store/user';

export function PartyList() {
  const userStore = useUserStore();
  const api = useWebsocketApi();
  const store = useMainStore();

  const query = useQuery({
    queryKey: ['all_parties'],
    enabled: !!store.websocket,
    refetchInterval: 1000 * 2, // 2 seconds
    queryFn: () => api.party.getAllOpenParties(),
  });

  const joinPartyMutation = useMutation({
    mutationFn: (partyId: number) => api.party.joinParty({ partyId }),
    onSuccess: () => query.refetch(),
  });
  const leavePartyMutation = useMutation({
    mutationFn: (partyId: number) => api.party.quitParty({ partyId }),
    onSuccess: () => query.refetch(),
  });

  return (
    <div className={styles.container}>
      <ForEach
        items={query.data || []}
        render={(party) => (
          <div key={party.id} className={styles.party}>
            <div className={styles.partyMemberList}>
              <ForEach
                items={party.members}
                render={(member) => (
                  <PartyMemberInfo key={member.id} member={member} isLeader={member.email === party.leaderEmail} />
                )}
              />
            </div>
            <When value={userStore.party?.id === party.id}>
              <Button
                label="Leave"
                onClick={() => leavePartyMutation.mutate(party.id ?? 0)}
                disabled={leavePartyMutation.isPending}
              />
            </When>
            <When value={userStore.party?.id !== party.id}>
              <Button
                label="Join"
                onClick={() => joinPartyMutation.mutate(party.id ?? 0)}
                disabled={joinPartyMutation.isPending}
              />
            </When>
          </div>
        )}
      />
    </div>
  );
}

export function PartyMemberInfo({ member, isLeader }: { member: User; isLeader: boolean }) {
  return (
    <div className={styles.partyMemberHeadInfo}>
      <span>{member.name}</span>
      <When value={isLeader}>
        <FaCrown size={16} color="gold" />
      </When>
      <When value={!isLeader}>
        <FaChessPawn size={16} color="white" />
      </When>
      <CharacterHead gender={member.appearance.gender} head={member.appearance.head} />
    </div>
  );
}
