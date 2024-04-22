import styles from './style.module.scss';

import { CharacterInfo } from '@/components/Character/CharacterInfo';
import HealthBar from '@/components/HealthBar';
import { When } from '@/components/shared/When';
import ManaBar from '../../ManaBar';
import { CharacterPose } from '../CharacterPose';
import BuffList from '../BuffList';

type Props = {
  user?: BattleUser;
  highestAggro?: boolean;
  classInfo?: boolean;
  orientation?: 'front' | 'back';
  onClick?: () => void;
};

export function CharacterWithHealthBar({
  orientation = 'front',
  user,
  classInfo = false,
  highestAggro,
  onClick,
}: Props) {
  const buffs = user?.buffs ?? [];
  const buffPose = buffs?.find((b) => b.buff.pose);
  return (
    <When value={!!user}>
      <div onClick={onClick} className={styles.userContainer}>
        <CharacterPose pose={buffPose?.buff.pose} />
        <When value={buffs.length > 0}>
          <BuffList buffs={user?.buffs} />
        </When>

        <span className={styles.userName}>{user?.name}</span>
        <When value={user?.aggro != undefined}>
          <div className={styles.aggroContainer}>
            <img
              width={25}
              height={25}
              src={`https://kidmortal.sirv.com/misc/${highestAggro ? 'bossrage' : 'boss'}.webp?w=25&h=25`}
            />
            <span>{user?.aggro}</span>
          </div>
        </When>

        <When value={classInfo}>
          <span className={styles.classinfo}>
            LV {user?.stats?.level} {user?.profession?.name}
          </span>
        </When>
        <HealthBar
          currentHealth={user?.stats?.health ?? 0}
          maxHealth={user?.stats?.maxHealth ?? 0}
          minWidth="5rem"
          minHeight="0.3rem"
        />
        <ManaBar
          currentHealth={user?.stats?.mana ?? 0}
          maxHealth={user?.stats?.maxMana ?? 0}
          minWidth="5rem"
          minHeight="0.5rem"
        />
        <CharacterInfo
          costume={`${user?.appearance.costume}`}
          gender={user?.appearance.gender ?? 'male'}
          head={`${user?.appearance.head}`}
          orientation={orientation}
        />
      </div>
    </When>
  );
}
