import cn from "classnames";
import styles from "./style.module.scss";
import { useState } from "react";

const headScrMap: { [name: string]: { female: string; male: string } } = {
  head_1: {
    male: "assets/head_1_male.png",
    female: "assets/head_1_female.png",
  },
  head_1_back: {
    male: "assets/male_head_back.png",
    female: "assets/female_head1_back.png",
  },
};

const bodySrcMap: { [name: string]: string } = {
  acolyte: "assets/acolyte.png",
  mage: "assets/mage.png",
  assassin: "assets/assassin.png",
  knight: "assets/knight.png",
  knight_back: "assets/knight_back.png",
  mage_back: "assets/mage_back.png",
};

export function CharacterHead({
  gender,
  head,
}: {
  head: string;
  gender: "male" | "female";
}) {
  return (
    <img
      className={styles.isolatedHeadContainer}
      src={headScrMap[head]?.[gender]}
    />
  );
}

export function CharacterInfo({
  costume,
  gender,
  head,
  onClick,
}: {
  costume: string;
  head: string;
  gender: "male" | "female";
  onClick?: () => void;
}) {
  const [assetLoaded, setAssetLoaded] = useState(false);
  return (
    <div className={styles.characterContainer} onClick={onClick}>
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
