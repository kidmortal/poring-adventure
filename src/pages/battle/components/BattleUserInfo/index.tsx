import styles from "./style.module.scss";

import { CharacterInfo } from "@/components/CharacterInfo";
import HealthBar from "@/components/HealthBar";
import { When } from "@/components/When";

type Props = {
  user?: User;
};

export function BattleUserInfo(props: Props) {
  return (
    <When value={!!props.user}>
      <div className={styles.userContainer}>
        <span>{props.user?.name}</span>
        <HealthBar
          currentHealth={props.user?.stats?.health ?? 0}
          maxHealth={props.user?.stats?.maxHealth ?? 0}
        />
        <CharacterInfo
          costume={`${props.user?.classname}`}
          gender={props.user?.appearance.gender ?? "male"}
          head={`${props.user?.appearance.head}`}
          orientation="back"
        />
      </div>
    </When>
  );
}
