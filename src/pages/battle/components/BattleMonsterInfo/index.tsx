import { When } from '@/components/shared/When';
import styles from './style.module.scss';
import { EffectList } from '@/components/StatsComponents/EffectList';
import { buffEffects, debuffEffects } from '@/components/StatsComponents/EffectList/effects';
import { StatBar } from '@/components/StatsComponents/StatBar';

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
      {/* A bar rather than a number, because what matters mid-fight is how much
          of it is left, not the figure — and the attack is gone with it: it was
          a constant the player could do nothing about, sitting where the one
          changing number belongs. `maxHealth` is what it stood up with. */}
      <div className={styles.healthBar}>
        {/* Not `HealthBar`: its "HP" prefix costs three characters of a bar this
            narrow, and a guild boss's five-digit pool would clip. The bar is red
            and sits under a monster — nothing else it could be counting. */}
        <StatBar
          variant="health"
          percentage={Math.floor((monster.health / (monster.maxHealth || monster.health || 1)) * 100)}
          label={`${monster.health}/${monster.maxHealth ?? monster.health}`}
        />
      </div>

      {/* Everything riding on it, in one row: what the party stuck on it and
          what it is wearing itself, told apart by the colour of the count. */}
      <EffectList effects={effects} />

      <img className={styles.sprite} src={monster.image} alt={monster.name} />
    </div>
  );
}
