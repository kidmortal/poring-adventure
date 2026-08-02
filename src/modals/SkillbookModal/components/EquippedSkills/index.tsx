import cn from 'classnames';

import styles from './style.module.scss';
import { When } from '@/components/shared/When';
import { skillKind } from '../../skillInfo';

type Props = {
  skills?: LearnedSkill[];
  /** Slots the class takes into battle, empty ones included. */
  slots: number;
  disabled?: boolean;
  onClick: (skillId: number) => void;
};

export default function EquippedSkills({ skills = [], slots, disabled, onClick }: Props) {
  // Empty slots are drawn too, so "2/4" is something you can see and not just read.
  const cells = Array.from({ length: slots }, (_, index) => skills[index]);

  return (
    <div className={styles.container}>
      {cells.map((equipped, index) => (
        <div
          key={equipped?.id ?? `empty-${index}`}
          role={equipped ? 'button' : undefined}
          title={equipped ? `${equipped.skill.name} — tap to unequip` : 'Empty slot'}
          onClick={() => {
            if (equipped && !disabled) onClick(equipped.skillId);
          }}
          className={cn(styles.slot, {
            [styles.filled]: !!equipped,
            [styles[skillKind(equipped?.skill)]]: !!equipped,
          })}
        >
          <When value={!!equipped}>
            <img src={equipped?.skill.image} alt={equipped?.skill.name} />
            <span className={styles.slotName}>{equipped?.skill.name}</span>
          </When>
          <When value={!equipped}>
            <span className={styles.empty}>+</span>
          </When>
        </div>
      ))}
    </div>
  );
}
