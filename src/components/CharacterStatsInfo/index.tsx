import HealthBar from "../HealthBar";
import styles from "./style.module.scss";
import { useMainStore } from "@/store/main";

export function Stat(props: { label: string; assetName: string }) {
  return (
    <div className={styles.statContainer}>
      <img src={`https://kidmortal.sirv.com/misc/${props.assetName}.webp`} />
      <span>{props.label}</span>
    </div>
  );
}

export function CharacterStatsInfo() {
  const store = useMainStore();

  let bonusHealth = 0;
  let bonusAttack = 0;
  const equippedItems = store.userCharacterData?.equipment;
  if (equippedItems) {
    equippedItems.forEach((equip) => {
      if (equip?.item?.health) {
        bonusHealth += equip.item.health;
      }
      if (equip?.item?.attack) {
        bonusAttack += equip.item.attack;
      }
    });
  }

  return (
    <div className={styles.container}>
      <HealthBar
        currentHealth={store.userCharacterData?.stats?.health ?? 0}
        maxHealth={store.userCharacterData?.stats?.maxHealth ?? 0}
      />
      <Stat
        assetName="health"
        label={`HP: ${store.userCharacterData?.stats?.maxHealth} + ${bonusHealth}`}
      />
      <Stat
        assetName="attack"
        label={`ATK: ${store.userCharacterData?.stats?.attack} + ${bonusAttack}`}
      />
      <Stat
        assetName="str"
        label={`STR: ${store.userCharacterData?.stats?.str}`}
      />
      <Stat
        assetName="agi"
        label={`AGI: ${store.userCharacterData?.stats?.agi}`}
      />
      <Stat
        assetName="int"
        label={`INT: ${store.userCharacterData?.stats?.int}`}
      />
    </div>
  );
}
