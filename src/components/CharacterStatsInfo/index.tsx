import HealthBar from "../HealthBar";
import styles from "./style.module.scss";
import { useMainStore } from "@/store/main";

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
      <HealthBar currentHealth={20} maxHealth={20} />
      <div className={styles.statContainer}>
        <img src="assets/stats/health.webp" />
        <span>
          HP: {store.userCharacterData?.stats?.health} + {bonusHealth}
        </span>
      </div>
      <div className={styles.statContainer}>
        <img src="assets/stats/attack.webp" />
        <span>
          ATK: {store.userCharacterData?.stats?.attack} + {bonusAttack}
        </span>
      </div>
      <div className={styles.statContainer}>
        <img src="assets/stats/str.webp" />
        <span>STR: {store.userCharacterData?.stats?.str}</span>
      </div>
      <div className={styles.statContainer}>
        <img src="assets/stats/agi.webp" />
        <span>AGI: {store.userCharacterData?.stats?.agi}</span>
      </div>
      <div className={styles.statContainer}>
        <img src="assets/stats/int.webp" />
        <span>INT: {store.userCharacterData?.stats?.int}</span>
      </div>
    </div>
  );
}
