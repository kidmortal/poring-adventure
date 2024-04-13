import { useUserStore } from "@/store/user";
import BuffList from "../BuffList";
import HealthBar from "../HealthBar";
import ManaBar from "../ManaBar";
import styles from "./style.module.scss";

export function Stat(props: { label: string; assetName: string }) {
  return (
    <div className={styles.statContainer}>
      <img src={`https://kidmortal.sirv.com/misc/${props.assetName}.webp`} />
      <span>{props.label}</span>
    </div>
  );
}

export function CharacterStatsInfo() {
  const userStore = useUserStore();

  let bonusHealth = 0;
  let bonusMana = 0;
  let bonusAttack = 0;
  let bonusStr = 0;
  let bonusAgi = 0;
  let bonusInt = 0;
  const equippedItems = userStore.user?.equipment;
  const user = userStore.user;
  const stats = user?.stats;
  if (equippedItems) {
    equippedItems.forEach((equip) => {
      if (equip?.item?.health) {
        bonusHealth += equip.item.health;
      }
      if (equip?.item?.mana) {
        bonusMana += equip.item.mana;
      }
      if (equip?.item?.attack) {
        bonusAttack += equip.item.attack;
      }
      if (equip?.item?.str) {
        bonusStr += equip.item.str;
      }
      if (equip?.item?.agi) {
        bonusAgi += equip.item.agi;
      }
      if (equip?.item?.int) {
        bonusInt += equip.item.int;
      }
    });
  }
  const rawHealth = (stats?.maxHealth || 0) - bonusHealth;
  const rawMana = (stats?.maxMana || 0) - bonusMana;
  const rawAtk = (stats?.attack || 0) - bonusAttack;
  const rawStr = (stats?.str || 0) - bonusStr;
  const rawAgi = (stats?.agi || 0) - bonusAgi;
  const rawInt = (stats?.int || 0) - bonusInt;

  return (
    <div className={styles.container}>
      <div className={styles.healthContainer}>
        <HealthBar
          currentHealth={userStore.user?.stats?.health ?? 0}
          maxHealth={userStore.user?.stats?.maxHealth ?? 0}
        />
        <ManaBar
          currentHealth={userStore.user?.stats?.mana ?? 0}
          maxHealth={userStore.user?.stats?.maxMana ?? 0}
        />
      </div>
      <BuffList buffs={user?.buffs} />
      <Stat assetName="health" label={`HP: ${rawHealth} +${bonusHealth}`} />
      <Stat assetName="mana" label={`MP: ${rawMana} +${bonusMana}`} />
      <Stat assetName="attack" label={`ATK: ${rawAtk} +${bonusAttack}`} />
      <Stat assetName="str" label={`STR: ${rawStr} +${bonusStr}`} />
      <Stat assetName="agi" label={`AGI: ${rawAgi} +${bonusAgi}`} />
      <Stat assetName="int" label={`INT: ${rawInt} +${bonusInt}`} />
    </div>
  );
}
