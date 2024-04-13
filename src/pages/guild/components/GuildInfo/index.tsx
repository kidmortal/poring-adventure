import styles from "./style.module.scss";
import { Button } from "@/components/Button";
import ExperienceBar from "@/components/ExperienceBar";
import { FaStoreAltSlash } from "react-icons/fa";

export function GuildInfo({ guild }: { guild?: Guild }) {
  return (
    <div className={styles.guildInfoContainer}>
      <img width={80} height={80} src={guild?.imageUrl} />
      <div className={styles.guildLevelContainer}>
        <h3>{guild?.name}</h3>
        <span>LVL: {guild?.level}</span>
        <ExperienceBar currentExp={guild?.experience} level={guild?.level} />
      </div>
      <div className={styles.guildResourcesContainer}>
        <div className={styles.row}>
          <img src="https://kidmortal.sirv.com/misc/soulshard.webp?w=20&h=20" />
          <span>{guild?.taskPoints}</span>
        </div>
      </div>
      <div>
        <Button label={<FaStoreAltSlash size={24} />} />
      </div>
    </div>
  );
}
