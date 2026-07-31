import { useUserStore } from '@/store/user';
import BuffList from '../../StatsComponents/BuffList';
import HealthBar from '../../StatsComponents/HealthBar';
import ManaBar from '../../StatsComponents/ManaBar';
import styles from './style.module.scss';

/**
 * `label` alone renders as plain text (item tooltips, profession picker).
 * Passing `value`/`bonus` renders the base number and the equipment bonus separately.
 */
export function Stat(props: { label: string; assetName: string; value?: number; bonus?: number }) {
  return (
    <div className={styles.statContainer}>
      <img src={`https://kidmortal.sirv.com/misc/${props.assetName}.webp`} />
      <span className={styles.statLabel}>{props.label}</span>
      {props.value !== undefined && <span className={styles.statValue}>{props.value}</span>}
      {!!props.bonus && <span className={styles.statBonus}>+{props.bonus}</span>}
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
  const equippedItems = userStore.user?.inventory.filter((item) => item.equipped) ?? [];
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
        <ManaBar currentHealth={userStore.user?.stats?.mana ?? 0} maxHealth={userStore.user?.stats?.maxMana ?? 0} />
      </div>
      <BuffList buffs={user?.buffs} />
      <div className={styles.statGrid}>
        <Stat assetName="health" label="HP" value={rawHealth} bonus={bonusHealth} />
        <Stat assetName="mana" label="MP" value={rawMana} bonus={bonusMana} />
        <Stat assetName="attack" label="ATK" value={rawAtk} bonus={bonusAttack} />
        <Stat assetName="str" label="STR" value={rawStr} bonus={bonusStr} />
        <Stat assetName="agi" label="AGI" value={rawAgi} bonus={bonusAgi} />
        <Stat assetName="int" label="INT" value={rawInt} bonus={bonusInt} />
      </div>
    </div>
  );
}
