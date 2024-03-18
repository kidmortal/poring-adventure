import styles from "./style.module.scss";

import { CharacterInfo } from "@/components/CharacterInfo";
import HealthBar from "@/components/HealthBar";
import { When } from "@/components/When";
import ManaBar from "../ManaBar";
import { CharacterPose } from "../CharacterPose";
import BuffList from "../BuffList";

type Props = {
  user?: User;
  classInfo?: boolean;
  orientation?: "front" | "back";
};

export function CharacterWithHealthBar({
  orientation = "front",
  user,
  classInfo = false,
}: Props) {
  const buffPose = user?.buffs?.find((b) => b.buff.pose);
  return (
    <When value={!!user}>
      <div className={styles.userContainer}>
        <CharacterPose pose={buffPose?.buff.pose} />
        <BuffList buffs={user?.buffs} />
        <span>{user?.name}</span>
        <When value={classInfo}>
          <span className={styles.classinfo}>
            LV {user?.stats?.level} {user?.profession?.name}
          </span>
        </When>
        <HealthBar
          currentHealth={user?.stats?.health ?? 0}
          maxHealth={user?.stats?.maxHealth ?? 0}
          minWidth="5rem"
          minHeight="0.3rem"
        />
        <ManaBar
          currentHealth={user?.stats?.mana ?? 0}
          maxHealth={user?.stats?.maxMana ?? 0}
          minWidth="5rem"
          minHeight="0.5rem"
        />
        <CharacterInfo
          costume={`${user?.appearance.costume}`}
          gender={user?.appearance.gender ?? "male"}
          head={`${user?.appearance.head}`}
          orientation={orientation}
        />
      </div>
    </When>
  );
}
