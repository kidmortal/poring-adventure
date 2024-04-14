import styles from "./style.module.scss";
import { BaseModal } from "../BaseModal";
import { Button } from "@/components/Button";

type Props = {
  isOpen?: boolean;
  onRequestClose: () => void;
};

export function GuildBlessingModal({ isOpen, onRequestClose }: Props) {
  return (
    <BaseModal onRequestClose={onRequestClose} isOpen={isOpen}>
      <div className={styles.container}>
        <Blessing
          name="Health"
          src="https://kidmortal.sirv.com/misc/blessing_health.png"
        />
        <Blessing
          name="Mana"
          src="https://kidmortal.sirv.com/misc/blessing_mana.png"
        />

        <Blessing
          name="Strength"
          src="https://kidmortal.sirv.com/misc/blessing_str.png"
        />
        <Blessing
          name="Agility"
          src="https://kidmortal.sirv.com/misc/blessing_agi.png"
        />
        <Blessing
          name="Intelligence"
          src="https://kidmortal.sirv.com/misc/blessing_int.png"
        />
      </div>
    </BaseModal>
  );
}

function Blessing(props: { name: string; src: string }) {
  return (
    <div className={styles.blessingContainer}>
      <div className={styles.row}>
        <strong>Lv 3</strong>
        <img src={props.src} />
      </div>
      <p>{props.name}</p>

      <Button
        label={
          <div className={styles.updateButtonContainer}>
            <span>100</span>
            <img src="https://kidmortal.sirv.com/misc/soulshard.webp?w=20&h=20" />
          </div>
        }
      />
    </div>
  );
}
