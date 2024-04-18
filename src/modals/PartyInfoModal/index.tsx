import { useMutation, useQuery } from '@tanstack/react-query';
import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import { Query } from '@/store/query';
import { useMainStore } from '@/store/main';
import { useWebsocketApi } from '@/api/websocketServer';
import { When } from '@/components/When';
import { Button } from '@/components/Button';
import ForEach from '@/components/ForEach';
import { CharacterWithHealthBar } from '@/components/CharacterWithHealthBar';
import { useUserStore } from '@/store/user';

type Props = {
  isOpen?: boolean;
  party?: Party;
  onRequestClose: (i?: InventoryItem) => void;
};

export function PartyInfoModal(props: Props) {
  const api = useWebsocketApi();
  const store = useMainStore();
  const userStore = useUserStore();
  const user = userStore.user;
  const partyId = user?.partyId ?? 0;
  const query = useQuery({
    queryKey: [Query.PARTY],
    enabled: !!store.websocket && !!userStore.user?.partyId,
    staleTime: Infinity,
    queryFn: () => api.party.getParty({ partyId }),
  });

  const createPartyMutation = useMutation({
    mutationFn: () => api.party.createParty(),
  });
  const deletePartyMutation = useMutation({
    mutationFn: () => api.party.removeParty(),
  });

  const removeFromPartyMutation = useMutation({
    mutationFn: (email: string) => api.party.kickFromParty({ kickedEmail: email, partyId }),
  });

  const quitPartyMutation = useMutation({
    mutationFn: (partyId: number) => api.party.quitParty({ partyId }),
  });

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.container}>
        <When value={query.isLoading}>
          <span>Loading</span>
        </When>
        <When value={!query.isLoading}>
          <When value={!props.party?.id}>
            <Button
              label="Create a new party"
              onClick={() => createPartyMutation.mutate()}
              disabled={createPartyMutation.isPending}
            />
          </When>
          <When value={!!props.party?.id}>
            <ForEach
              items={props.party?.members}
              render={(u) => (
                <div key={u.email} className={styles.memberContainer}>
                  <CharacterWithHealthBar user={u} classInfo />
                  <Button
                    label="Remove"
                    onClick={() => removeFromPartyMutation.mutate(u.email)}
                    disabled={removeFromPartyMutation.isPending}
                  />
                </div>
              )}
            />
            <When value={user?.email !== props.party?.leaderEmail}>
              <Button
                label="Leave party"
                onClick={() => quitPartyMutation.mutate(props.party?.id ?? 0)}
                disabled={quitPartyMutation.isPending}
              />
            </When>
            <When value={user?.email === props.party?.leaderEmail}>
              <Button
                label="Disband party"
                onClick={() => deletePartyMutation.mutate()}
                disabled={deletePartyMutation.isPending}
              />
            </When>
          </When>
        </When>
      </div>
    </BaseModal>
  );
}
