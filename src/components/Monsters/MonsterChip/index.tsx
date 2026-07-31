import styles from './style.module.scss';
import cn from 'classnames';

/** Sprite, name and level for one monster. Bosses are highlighted. */
export function MonsterChip({ monster }: { monster: Monster }) {
  return (
    <div className={cn(styles.monsterChip, { [styles.boss]: monster.boss })}>
      <img className={styles.monsterSprite} src={monster.image} alt={monster.name} />
      <span className={styles.monsterName}>{monster.name}</span>
      <span className={styles.monsterLevel}>Lv {monster.level}</span>
    </div>
  );
}
