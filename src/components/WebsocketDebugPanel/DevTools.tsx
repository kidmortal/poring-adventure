import { useLocation, useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import styles from './style.module.scss';
import ForEach from '@/components/shared/ForEach';
import { useModalStore, ModalState } from '@/store/modal';
import { useMainStore } from '@/store/main';
import { useUserStore } from '@/store/user';
import { useBattleStore } from '@/store/battle';
import { useWebsocketApi } from '@/api/websocketServer';
import { When } from '@/components/shared/When';
import { Query } from '@/store/query';

/**
 * Every modal that opens with no argument. The ones that need a subject — an
 * item, a party member, a recipe — are left out: opening them empty shows a
 * broken sheet rather than the design being checked.
 */
const MODALS: { label: string; setter: keyof ModalState }[] = [
  { label: 'Skillbook', setter: 'setSkillbook' },
  { label: 'Blessings', setter: 'setGuildBlessing' },
  { label: 'Guild task', setter: 'setGuildTaskSelect' },
  { label: 'Summon boss', setter: 'setGuildBossSummon' },
  { label: 'Mailbox', setter: 'setMailBox' },
  { label: 'Friends', setter: 'setFriendlist' },
  { label: 'Settings', setter: 'setUserConfig' },
  { label: 'Edit character', setter: 'setEditCharacter' },
  { label: 'Discord', setter: 'setDiscordIntegration' },
];

/**
 * The shortcuts that sit alongside the frame log.
 *
 * Everything here is safe for anyone who can see the panel at all: the screen
 * jumps, the modal openers and the cache buttons only move the client around.
 * The Battle section is the exception — it calls admin events, so it is behind
 * `user.admin`, and the server's `AdminGuard` refuses them regardless of what
 * the client chooses to render.
 *
 * The screens here are ones the app normally only reaches by being in a state
 * you would not want to be in — character creation needs no character, so
 * checking its layout used to mean deleting the one you play. `/create` is a
 * real route outside `CharacterLayout`, so it renders with a character sitting
 * happily in the database; the server refuses the second `create_user` on the
 * email's unique constraint, which makes the screen a preview and not a way to
 * lose anything.
 */
export function DevTools() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const modalStore = useModalStore();
  const user = useUserStore((s) => s.user);
  const websocket = useMainStore((s) => s.websocket);
  const battle = useBattleStore((s) => s.battle);
  const api = useWebsocketApi();

  const isAdmin = !!user?.admin;
  // The battle the client knows about. A settled one is still on screen until
  // it is dismissed, so it is worth saying which state the button is refusing.
  const inBattle = !!battle && !battle.battleFinished;

  const onCreationScreen = location.pathname === '/create';

  return (
    <div className={styles.tools}>
      <section className={styles.toolSection}>
        <span className={styles.toolTitle}>Screens</span>
        <div className={styles.toolRow}>
          <button
            type="button"
            className={styles.tool}
            disabled={onCreationScreen}
            onClick={() => navigate('/create')}
          >
            Character creation
          </button>
          <button type="button" className={styles.tool} disabled={!onCreationScreen} onClick={() => navigate('/')}>
            Back to game
          </button>
        </div>
        <span className={styles.toolHint}>
          Creation is a preview: the server refuses a second character for this account.
        </span>
      </section>

      <section className={styles.toolSection}>
        <span className={styles.toolTitle}>Modals</span>
        <div className={styles.toolRow}>
          <ForEach
            items={MODALS}
            render={(modal) => (
              <button
                key={modal.label}
                type="button"
                className={styles.tool}
                onClick={() => (modalStore[modal.setter] as (v: { open: boolean }) => void)({ open: true })}
              >
                {modal.label}
              </button>
            )}
          />
        </div>
        <span className={styles.toolHint}>A modal wants a character — most read one, and show empty without.</span>
      </section>

      <When value={isAdmin}>
        <section className={styles.toolSection}>
          <span className={styles.toolTitle}>Battle</span>
          <div className={styles.toolRow}>
            <button
              type="button"
              className={styles.tool}
              disabled={!inBattle}
              onClick={() => api.admin.killBattleMonsters()}
            >
              Kill monsters
            </button>
            <button
              type="button"
              className={styles.tool}
              disabled={!battle}
              onClick={() => api.admin.forceEndBattle({ email: user?.email ?? '' })}
            >
              End battle
            </button>
          </div>
          {/* It settles through the battle's own victory path, so the drops,
              the experience and a dungeon's next stage all happen for real. */}
          <span className={styles.toolHint}>
            Kill pays the fight out as a win — drops, rewards and dungeon stage included.
          </span>
        </section>
      </When>

      <section className={styles.toolSection}>
        <span className={styles.toolTitle}>Cache</span>
        <div className={styles.toolRow}>
          <button
            type="button"
            className={styles.tool}
            onClick={() => queryClient.invalidateQueries({ queryKey: [Query.USER_CHARACTER] })}
          >
            Refetch character
          </button>
          <button type="button" className={styles.tool} onClick={() => queryClient.invalidateQueries()}>
            Refetch everything
          </button>
          <button type="button" className={styles.tool} onClick={() => queryClient.clear()}>
            Drop cache
          </button>
        </div>
      </section>

      <section className={styles.toolSection}>
        <span className={styles.toolTitle}>Session</span>
        <dl className={styles.facts}>
          <div className={styles.fact}>
            <dt>socket</dt>
            <dd>{websocket?.id ?? '—'}</dd>
          </div>
          <div className={styles.fact}>
            <dt>character</dt>
            <dd>{user?.name ?? 'none'}</dd>
          </div>
          <div className={styles.fact}>
            <dt>class</dt>
            <dd>{user?.class?.name ?? '—'}</dd>
          </div>
          <div className={styles.fact}>
            <dt>level</dt>
            <dd>{user?.stats?.level ?? '—'}</dd>
          </div>
          <div className={styles.fact}>
            <dt>admin</dt>
            <dd>{isAdmin ? 'yes' : 'no'}</dd>
          </div>
          <div className={styles.fact}>
            <dt>route</dt>
            <dd>{location.pathname}</dd>
          </div>
        </dl>
      </section>
    </div>
  );
}
