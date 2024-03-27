import { useModalStore } from "@/store/modal";
import styles from "./style.module.scss";
import ForEach from "@/components/ForEach";
import { CharacterInfo } from "@/components/CharacterInfo";
import { Silver } from "@/components/Silver";

type Props = {
  users?: User[];
};

export function PlayersRankingPage(props: Props) {
  const modal = useModalStore();
  return (
    <div className={styles.container}>
      <ForEach
        items={props.users}
        render={(u) => (
          <div
            className={styles.characterContainer}
            key={u.email}
            onClick={() =>
              modal.setInteractUser({
                open: true,
                user: u,
              })
            }
          >
            <CharacterInfo
              costume={u.appearance?.costume}
              gender={u.appearance?.gender}
              head={u.appearance?.head}
            />
            <div className={styles.characterInfo}>
              <span>
                {u.name} - LV {u.stats?.level} {u?.profession?.name}
              </span>
              <Silver amount={u.silver} />
            </div>
          </div>
        )}
      />
    </div>
  );
}
