import { useEffect, useRef, useState } from 'react';
import cn from 'classnames';
import { useMutation, useQuery } from '@tanstack/react-query';
import { FaCrown, FaDoorOpen, FaLock, FaLockOpen, FaPaperPlane, FaTrash, FaUserPlus } from 'react-icons/fa';

import { useWebsocketApi } from '@/api/websocketServer';
import styles from './style.module.scss';
import { useMainStore } from '@/store/main';
import { useUserStore } from '@/store/user';
import { useModalStore } from '@/store/modal';
import { Query } from '@/store/query';
import { When } from '@/components/shared/When';
import { Button } from '@/components/shared/Button';
import ForEach from '@/components/shared/ForEach';
import { CharacterWithHealthBar } from '@/components/Character/CharacterWithHealthBar';
import { LoadingBlock } from '@/components/shared/LoadingBlock';

/** Party capacity, mirrored from the server rule. */
const MAX_PARTY_MEMBERS = 4;

export function PartyInfo() {
  const listRef = useRef(null);
  const [chatMessage, setChatMessage] = useState('');
  const api = useWebsocketApi();
  const store = useMainStore();
  const userStore = useUserStore();
  const modalStore = useModalStore();
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
  const isOpen = !!userStore.partyStatus?.isPartyOpen;
  const members = userStore.party?.members ?? [];
  const chat = userStore.partyStatus?.chat ?? [];

  useEffect(() => {
    // @ts-expect-error html stuff
    listRef.current?.lastElementChild?.scrollIntoView();
  }, [userStore.partyStatus?.chat]);

  if (query.isLoading) {
    return <LoadingBlock info="Loading party" />;
  }

  if (!party?.id) {
    return (
      <div className={styles.emptyState}>
        <span className={styles.emptyTitle}>You are on your own</span>
        <span className={styles.emptyHint}>A party shares every drop and every fight, up to four of you.</span>
        <Button
          label={
            <span className={styles.buttonLabel}>
              <FaUserPlus /> Create a party
            </span>
          }
          onClick={() => createPartyMutation.mutate()}
          disabled={createPartyMutation.isPending}
        />
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Who you are and what state the party is in, before any of the buttons. */}
      <header className={styles.header}>
        <div className={styles.headerText}>
          <span className={styles.title}>Party</span>
          <span className={styles.subtitle}>
            {members.length}/{MAX_PARTY_MEMBERS} members · {userIsLeader ? 'you lead' : 'led by another'}
          </span>
        </div>
        <span className={cn(styles.statusBadge, { [styles.openBadge]: isOpen })}>
          {isOpen ? <FaLockOpen /> : <FaLock />}
          {isOpen ? 'open' : 'closed'}
        </span>
      </header>

      <When value={userIsLeader}>
        <div className={styles.leaderActions}>
          <Button
            className={styles.leaderButton}
            theme={isOpen ? 'neutral' : 'primary'}
            label={
              <span className={styles.buttonLabel}>
                {isOpen ? <FaLock /> : <FaLockOpen />}
                {isOpen ? 'Close' : 'Open'}
              </span>
            }
            onClick={() =>
              isOpen
                ? closePartyMutation.mutate(userStore.party?.id ?? 0)
                : openPartyMutation.mutate(userStore.party?.id ?? 0)
            }
            disabled={openPartyMutation.isPending || closePartyMutation.isPending}
          />
          <Button
            className={styles.leaderButton}
            theme="danger"
            label={
              <span className={styles.buttonLabel}>
                <FaTrash /> Disband
              </span>
            }
            onClick={() => deletePartyMutation.mutate()}
            disabled={deletePartyMutation.isPending}
          />
        </div>
      </When>

      <When value={!userIsLeader}>
        <Button
          className={styles.leaveButton}
          theme="neutral"
          label={
            <span className={styles.buttonLabel}>
              <FaDoorOpen /> Leave party
            </span>
          }
          onClick={() => quitPartyMutation.mutate(userStore.party?.id ?? 0)}
          disabled={quitPartyMutation.isPending}
        />
      </When>

      <div className={styles.memberList}>
        <ForEach
          items={members}
          render={(member) => (
            <PartyMemberCard
              key={member.id}
              user={member}
              party={userStore.party}
              onClick={() => modalStore.setPartyMember({ open: true, member })}
            />
          )}
        />
      </div>

      <div ref={listRef} className={styles.chat}>
        <When value={chat.length === 0}>
          <span className={styles.chatEmpty}>No one has said anything yet</span>
        </When>
        <ForEach items={chat} render={(message, idx) => <ChatLine key={`${message}${idx}`} message={message} />} />
      </div>

      <div className={styles.chatInput}>
        <input
          onKeyUp={(e) => {
            if (e.key === 'Enter' && chatMessage.trim()) {
              sendChatMessageMutation.mutate();
            }
          }}
          value={chatMessage}
          maxLength={140}
          onChange={(e) => setChatMessage(e.target.value)}
          placeholder="Say something"
        />
        <button
          className={styles.sendButton}
          onClick={() => sendChatMessageMutation.mutate()}
          disabled={sendChatMessageMutation.isPending || !chatMessage.trim()}
          aria-label="Send message"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}

/** Messages arrive as "Name: text", so the author is split back out to style it. */
function ChatLine({ message }: { message: string }) {
  const userStore = useUserStore();
  const separator = message.indexOf(':');
  const author = separator > 0 ? message.slice(0, separator) : '';
  const text = separator > 0 ? message.slice(separator + 1).trim() : message;
  const isMine = !!author && author === userStore.user?.name;

  return (
    <div className={cn(styles.chatLine, { [styles.mine]: isMine })}>
      <When value={!!author}>
        <span className={styles.chatAuthor}>{author}</span>
      </When>
      <span className={styles.chatText}>{text}</span>
    </div>
  );
}

function PartyMemberCard(props: { user: User; party?: Party; onClick: () => void }) {
  const isLeader = props.party?.leaderEmail === props.user.email;

  return (
    <div className={styles.memberCard} onClick={props.onClick}>
      <span className={cn(styles.roleIcon, { [styles.leaderIcon]: isLeader })}>
        <When value={isLeader}>
          <FaCrown size={12} />
        </When>
      </span>
      <CharacterWithHealthBar user={props.user} classInfo />
    </div>
  );
}
