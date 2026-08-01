import cn from 'classnames';
import styles from './style.module.scss';

import ExperienceBar from '@/components/StatsComponents/ExperienceBar';
import { Button } from '@/components/shared/Button';
import { When } from '@/components/shared/When';

type Props = {
  profession: Profession;
  /** Present once the profession is learned — it carries its own progression. */
  userProfession?: UserProfession;
  disabled?: boolean;
  /** "Learn" for the first profession, "Swap" once one is already practiced. */
  actionLabel?: string;
  onLearn?: () => void;
};

export function ProfessionCard({ profession, userProfession, disabled, actionLabel = 'Learn', onLearn }: Props) {
  const learned = !!userProfession;

  return (
    <div className={cn(styles.container, { [styles.learned]: learned })}>
      <div className={styles.header}>
        {/* Emoji stand-in until the profession artwork exists. */}
        <span className={styles.icon}>{profession.icon}</span>
        <div className={styles.headerText}>
          <div className={styles.nameRow}>
            <h3>{profession.name}</h3>
            <span className={cn(styles.kind, styles[profession.kind])}>{profession.kind}</span>
            <When value={learned}>
              <span className={styles.level}>Lv {userProfession?.level}</span>
            </When>
          </div>
          <span className={styles.description}>{profession.description}</span>
        </div>
      </div>

      <When value={learned}>
        <ExperienceBar currentExp={userProfession?.experience} level={userProfession?.level} />
      </When>

      <When value={!learned}>
        <Button label={actionLabel} disabled={disabled} onClick={() => onLearn?.()} />
      </When>
    </div>
  );
}
