import cn from "classnames";
import styles from "./style.module.scss";

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
  return (
    <div className={styles.characterContainer}>
      <div className={cn(styles.character)}>
        <img className={styles.head} src={headScrMap[head]?.[gender]} />
        <img className={styles.body} src={bodySrcMap[costume]} />
      </div>
    </div>
  );
}
