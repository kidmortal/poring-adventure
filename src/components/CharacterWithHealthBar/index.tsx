import styles from "./style.module.scss";

import { CharacterInfo } from "@/components/CharacterInfo";
import HealthBar from "@/components/HealthBar";
import { When } from "@/components/When";

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
