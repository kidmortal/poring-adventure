import cn from 'classnames';

import { useModalStore } from '@/store/modal';
import { useUserStore } from '@/store/user';
import styles from './style.module.scss';
import ForEach from '@/components/shared/ForEach';
import { CharacterInfo } from '@/components/Character/CharacterInfo';
import { Silver } from '@/components/StatsComponents/Silver';
import { When } from '@/components/shared/When';

/** Server page size — what turns a row's position into its rank. */
const PLAYERS_PER_PAGE = 10;

type Props = {
  users?: User[];
  page: number;
};

export function PlayersRankingPage({ users, page }: Props) {
  const userStore = useUserStore();
  const list = users ?? [];

  return (
    <div className={styles.container}>
      <When value={list.length === 0}>
        <span className={styles.empty}>No player on this page</span>
      </When>
      <ForEach
        items={list}
        render={(user) => (
          <RankingPlayerBox
            key={user.id}
            user={user}
            rank={list.indexOf(user) + 1 + (page - 1) * PLAYERS_PER_PAGE}
            isSelf={user.email === userStore.user?.email}
          />
        )}
      />
    </div>
  );
}

function RankingPlayerBox({ user, rank, isSelf }: { user: User; rank: number; isSelf: boolean }) {
  const modal = useModalStore();
  // One profession per player, so the first row is the one they practice.
  const profession = user.professions?.[0];

  return (
    <div
      className={cn(styles.row, { [styles.self]: isSelf })}
      onClick={() =>
        modal.setInteractUser({
          open: true,
          user,
        })
      }
    >
      {/* Only the podium is worth colouring. */}
      <span className={cn(styles.rank, styles[`rank${rank}`])}>{rank}</span>

      <div className={styles.portrait}>
        <CharacterInfo
          costume={user.appearance?.costume}
          gender={user.appearance?.gender}
          head={user.appearance?.head}
        />
      </div>

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{user.name}</span>
          <When value={isSelf}>
            <span className={styles.youBadge}>you</span>
          </When>
        </div>
        {/* The short resume: what they fight as, and what they craft as. Gear
            is in the payload too, but it belongs in the profile modal. */}
        <div className={styles.resume}>
          <span className={styles.classChip}>
            {user.class?.name ?? 'No class'} <b>Lv {user.stats?.level ?? 1}</b>
          </span>
          <When value={!!profession}>
            <span className={styles.professionChip}>
              <span className={styles.professionIcon}>{profession?.profession?.icon}</span>
              <b>Lv {profession?.level}</b>
            </span>
          </When>
        </div>
        <span className={styles.experience}>{(user.stats?.experience ?? 0).toLocaleString()} exp</span>
      </div>

      <div className={styles.silver}>
        <Silver amount={user.silver} />
      </div>
    </div>
  );
}
