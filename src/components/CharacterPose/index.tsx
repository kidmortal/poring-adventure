import styles from "./style.module.scss";

import { When } from "@/components/When";

type Props = {
  pose?: string;
};

export function CharacterPose({ pose }: Props) {
  return (
    <When value={!!pose}>
      <div className={styles.container}>
        <When value={pose === "enhanced"}>
          <img src="https://kidmortal.sirv.com/effects/enhanced.png?w=100&h=140" />
        </When>
      </div>
    </When>
  );
}
