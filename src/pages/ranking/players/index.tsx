import { useModalStore } from '@/store/modal';
import styles from './style.module.scss';
import ForEach from '@/components/shared/ForEach';
import { CharacterInfo } from '@/components/Character/CharacterInfo';
import { Silver } from '@/components/Silver';

type Props = {
  users?: User[];
};

export function PlayersRankingPage(props: Props) {
  return (
    <div className={styles.container}>
      <ForEach items={props.users} render={(u) => <RankingPlayerBox key={u.id} user={u} />} />
    </div>
  );
}

function RankingPlayerBox(props: { user: User }) {
  const modal = useModalStore();
  return (
    <div
      className={styles.characterContainer}
      onClick={() =>
        modal.setInteractUser({
          open: true,
          user: props.user,
        })
      }
    >
      <CharacterInfo
        costume={props.user.appearance?.costume}
        gender={props.user.appearance?.gender}
        head={props.user.appearance?.head}
      />
      <div className={styles.characterInfo}>
        <span>
          {props.user.name} - LV {props.user.stats?.level} {props.user?.profession?.name}
        </span>
        <Silver amount={props.user.silver} />
      </div>
    </div>
  );
}
