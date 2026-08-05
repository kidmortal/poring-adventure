import { When } from '@/components/shared/When';
import styles from './style.module.scss';
import { EffectList } from '@/components/StatsComponents/EffectList';
import { buffEffects, debuffEffects } from '@/components/StatsComponents/EffectList/effects';

type Props = {
  monster?: Monster;
};

export function BattleMonsterInfo({ monster }: Props) {
  if (!monster) return <></>;

  const effects = [...buffEffects(monster.buffs), ...debuffEffects(monster.debuffs)];
  return (
    <div className={styles.monsterContainer}>
      <div className={styles.levelContainer}>
        <When value={monster.boss}>
          <img width={20} height={20} src="https://kidmortal.sirv.com/misc/boss.webp" />
        </When>
        <span>LV {monster.level}</span>
      </div>
      <span className={styles.monsterName}>{monster.name}</span>
      <div className={styles.statsContainer}>
        <span>HP {monster.health}</span>
        <span>ATK {monster.attack}</span>
      </div>

      {/* Everything riding on it, in one row: what the party stuck on it and
          what it is wearing itself, told apart by the colour of the count. */}
      <EffectList effects={effects} />

      <img className={styles.sprite} src={monster.image} alt={monster.name} />
    </div>
  );
}
