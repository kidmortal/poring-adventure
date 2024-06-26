import { useWebsocketApi } from '@/api/websocketServer';
import styles from './style.module.scss';
import { useMainStore } from '@/store/main';
import { useUserStore } from '@/store/user';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Query } from '@/store/query';
import { When } from '@/components/shared/When';
import { Button } from '@/components/shared/Button';
import ForEach from '@/components/shared/ForEach';
import { CharacterWithHealthBar } from '@/components/Character/CharacterWithHealthBar';
import { useEffect, useRef, useState } from 'react';
import { FaChessPawn, FaCrown } from 'react-icons/fa';

export function PartyInfo() {
  const listRef = useRef(null);
  const [chatMessage, setChatMessage] = useState('');
  const api = useWebsocketApi();
  const store = useMainStore();
  const userStore = useUserStore();
  const user = userStore.user;
  const party = userStore.party;
  const partyId = user?.partyId ?? 0;
  const query = useQuery({
    queryKey: [Query.PARTY],
    enabled: !!store.websocket && !!userStore.user?.partyId,
    staleTime: 1000 * 30, // 30 seconds
    queryFn: () => api.party.getParty({ partyId }),
  });

  const createPartyMutation = useMutation({
    mutationFn: () => api.party.createParty(),
  });
  const sendChatMessageMutation = useMutation({
    mutationFn: () =>
      api.party.sendChatMessage({
        partyId: userStore.party?.id ?? 0,
        message: `${user?.name}: ${chatMessage}`,
      }),
    onSuccess: () => setChatMessage(''),
  });
  const quitPartyMutation = useMutation({
    mutationFn: (partyId: number) => api.party.quitParty({ partyId }),
  });
  const deletePartyMutation = useMutation({
    mutationFn: () => api.party.removeParty({ partyId }),
  });

  const openPartyMutation = useMutation({
    mutationFn: (partyId: number) => api.party.openParty({ partyId }),
  });
  const closePartyMutation = useMutation({
    mutationFn: (partyId: number) => api.party.closeParty({ partyId }),
  });

  const userIsLeader = userStore.party?.leaderEmail === userStore.user?.email;

  useEffect(() => {
    // @ts-expect-error html stuff
    listRef.current?.lastElementChild?.scrollIntoView();
  }, [userStore.partyStatus?.chat]);

  return (
    <div className={styles.container}>
      <When value={query.isLoading}>
        <span>Loading</span>
      </When>
      <When value={!query.isLoading}>
        <When value={!party?.id}>
          <Button
            label="Create a new party"
            onClick={() => createPartyMutation.mutate()}
            disabled={createPartyMutation.isPending}
          />
        </When>
        <When value={!!party?.id}>
          <When value={userIsLeader}>
            <div className={styles.leaderActions}>
              <When value={!userStore.partyStatus?.isPartyOpen}>
                <Button
                  label="Open party"
                  onClick={() => openPartyMutation.mutate(userStore.party?.id ?? 0)}
                  disabled={openPartyMutation.isPending}
                />
              </When>
              <When value={!!userStore.partyStatus?.isPartyOpen}>
                <Button
                  label="Close party"
                  theme="danger"
                  onClick={() => closePartyMutation.mutate(userStore.party?.id ?? 0)}
                  disabled={closePartyMutation.isPending}
                />
              </When>

              <Button
                label="Disband"
                onClick={() => deletePartyMutation.mutate()}
                disabled={deletePartyMutation.isPending}
              />
              <Button
                label="Quit"
                onClick={() => quitPartyMutation.mutate(userStore.party?.id ?? 0)}
                disabled={quitPartyMutation.isPending}
              />
            </div>
          </When>
          <div className={styles.partyMemberList}>
            <ForEach
              items={userStore.party?.members}
              render={(u) => <PartyMemberInfo user={u} party={userStore.party} key={u.id} />}
            />
          </div>

          <div ref={listRef} className={styles.partyChat}>
            <ForEach items={userStore.partyStatus?.chat} render={(message) => <span>{message}</span>} />
          </div>
          <div className={styles.chatInputContainer}>
            <input
              onKeyUp={(e) => {
                if (e.key === 'Enter') {
                  sendChatMessageMutation.mutate();
                }
              }}
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="message"
            />
            <button onClick={() => sendChatMessageMutation.mutate()} disabled={sendChatMessageMutation.isPending}>
              Send
            </button>
          </div>
        </When>
      </When>
    </div>
  );
}

function PartyMemberInfo(props: { user: User; party?: Party }) {
  const isLeader = props.party?.leaderEmail === props.user.email;
  return (
    <div className={styles.memberContainer}>
      <When value={isLeader}>
        <FaCrown size={16} color="gold" />
      </When>
      <When value={!isLeader}>
        <FaChessPawn size={16} color="white" />
      </When>
      <CharacterWithHealthBar user={props.user} classInfo />
    </div>
  );
}
