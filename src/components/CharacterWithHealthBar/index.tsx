import styles from "./style.module.scss";

import { CharacterInfo } from "@/components/CharacterInfo";
import HealthBar from "@/components/HealthBar";
import { When } from "@/components/When";
import ManaBar from "../ManaBar";

type Props = {
  user?: User;
  orientation?: "front" | "back";
};

export function CharacterWithHealthBar({ orientation = "front", user }: Props) {
  return (
    <When value={!!user}>
      <div className={styles.userContainer}>
        <span>{user?.name}</span>
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
