import cn from "classnames";
import styles from "./style.module.scss";
import { useState } from "react";

const headScrMap: { [name: string]: { female: string; male: string } } = {
  head_1: {
    male: "assets/head_1_male.png",
    female: "assets/head_1_female.png",
  },
};

const bodySrcMap: { [name: string]: string } = {
  acolyte: "assets/acolyte.png",
  mage: "assets/mage.png",
  assassin: "assets/assassin.png",
  knight: "assets/knight.png",
};

export function CharacterInfo({
  costume,
  gender,
  head,
}: {
  costume: string;
  head: string;
  gender: "male" | "female";
}) {
  const [assetLoaded, setAssetLoaded] = useState(false);
  return (
    <div className={styles.characterContainer}>
      <div className={cn(styles.character, { [styles.hidden]: !assetLoaded })}>
        <img className={styles.head} src={headScrMap[head]?.[gender]} />
        <img
          className={styles.body}
          src={bodySrcMap[costume]}
          onLoad={() => setAssetLoaded(true)}
        />
      </div>
    </div>
  );
}
