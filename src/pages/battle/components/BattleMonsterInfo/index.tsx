import { When } from '@/components/shared/When';
import ForEach from '@/components/shared/ForEach';
import styles from './style.module.scss';

type Props = {
  monster?: Monster;
};

export function BattleMonsterInfo({ monster }: Props) {
  if (!monster) return <></>;

  const debuffs = monster.debuffs ?? [];
  const buffs = monster.buffs ?? [];
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

      {/* What the party has stuck on it, beside the health it is spending. The
          duration is on the icon because a shred expiring next turn and one
          that lasts three more are different plays. */}
      <When value={buffs.length > 0}>
        <div className={styles.debuffList}>
          <ForEach
            items={buffs}
            render={({ buff, duration }, index) => (
              <div key={`${buff.name}-${index}`} className={styles.debuff} title={buff.name}>
                <img width={20} height={20} src={buff.image} alt={buff.name} />
                <span className={styles.buffDuration}>{duration}</span>
              </div>
            )}
          />
        </div>
      </When>

      <When value={debuffs.length > 0}>
        <div className={styles.debuffList}>
          <ForEach
            items={debuffs}
            render={(debuff, index) => (
              <div key={`${debuff.name}-${index}`} className={styles.debuff} title={debuff.name}>
                <img width={20} height={20} src={debuff.image} alt={debuff.name} />
                <span className={styles.debuffDuration}>{debuff.duration}</span>
              </div>
            )}
          />
        </div>
      </When>

      <img className={styles.sprite} src={monster.image} alt={monster.name} />
    </div>
  );
}
