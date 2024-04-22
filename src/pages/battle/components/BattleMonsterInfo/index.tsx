import { When } from '@/components/shared/When';
import styles from './style.module.scss';
import { RefObject, useRef } from 'react';

type Props = {
  monster?: Monster;
};

export function BattleMonsterInfo({ monster }: Props) {
  const monsterRef = useRef<RefObject<HTMLDivElement>>();

  return (
    <When value={!!monster}>
      <div ref={monsterRef.current} className={styles.monsterContainer}>
        <When value={false}>
          <span className={styles.animatedDamage}>-6</span>
        </When>
        <div className={styles.levelContainer}>
          <When value={monster?.boss ?? false}>
            <img width={25} height={25} src="https://kidmortal.sirv.com/misc/boss.webp" />
          </When>
          <span>LV {monster?.level}</span>
        </div>
        <span>{monster?.name}</span>
        <div className={styles.statsContainer}>
          <span>HP {monster?.health}</span>
          <span>ATK {monster?.attack}</span>
        </div>
        <img src={monster?.image} />
      </div>
    </When>
  );
}
