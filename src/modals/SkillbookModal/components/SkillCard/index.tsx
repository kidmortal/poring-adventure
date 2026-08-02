import cn from 'classnames';
import { FaLock } from 'react-icons/fa';

import styles from './style.module.scss';
import { Button } from '@/components/shared/Button';
import { When } from '@/components/shared/When';
import Clock from '@/assets/Clock';
import { skillKind, skillKindLabel, skillScaling, skillTargetLabel } from '../../skillInfo';

type Props = {
  skill: Skill;
  /** Set for a skill the user owns — it multiplies the skill's potency. */
  masteryLevel?: number;
  locked?: boolean;
  action: string;
  /** Shown in place of the action when the skill cannot be acted on yet. */
  blockedReason?: string;
  disabled?: boolean;
  onClick: () => void;
};

/** One skill laid out in full: what it does, what it costs, and the way to take it. */
export function SkillCard({ skill, masteryLevel, locked, action, blockedReason, disabled, onClick }: Props) {
  const kind = skillKind(skill);
  const scaling = skillScaling(skill, masteryLevel);
  const blocked = !!blockedReason;

  return (
    <div className={cn(styles.card, { [styles.locked]: locked })}>
      <div className={styles.head}>
        <div className={styles.icon}>
          <img src={skill.image} alt={skill.name} />
          <When value={!!locked}>
            <span className={styles.lock}>
              <FaLock />
            </span>
          </When>
        </div>

        <div className={styles.headText}>
          <div className={styles.nameRow}>
            <h3 className={styles.name}>{skill.name}</h3>
            <When value={!!masteryLevel}>
              <span className={styles.mastery}>M{masteryLevel}</span>
            </When>
          </div>
          <div className={styles.tags}>
            <span className={cn(styles.kind, styles[kind])}>{skillKindLabel(skill)}</span>
            <span className={styles.target}>{skillTargetLabel(skill)}</span>
          </div>
        </div>
      </div>

      <p className={styles.description}>{skill.description}</p>

      <div className={styles.footer}>
        <div className={styles.chips}>
          <span className={styles.chip} title="Mana cost">
            <img width={14} height={14} src="https://kidmortal.sirv.com/misc/mana.webp?w=14&h=14" />
            {skill.manaCost}
          </span>
          <span className={styles.chip} title="Cooldown in turns">
            <Clock />
            {skill.cooldown}
          </span>
          <When value={!!scaling}>
            {/* Mastery is folded in, so this is the potency at the current level. */}
            <span className={cn(styles.chip, styles.scaling)} title="Potency, mastery included">
              {scaling}
            </span>
          </When>
          <When value={skill.requiredLevel > 1}>
            <span className={styles.chip} title="Required level">
              Lv {skill.requiredLevel}
            </span>
          </When>
        </div>

        <Button
          className={styles.action}
          theme={blocked ? 'neutral' : 'primary'}
          disabled={blocked || disabled}
          label={blockedReason ?? action}
          onClick={onClick}
        />
      </div>
    </div>
  );
}
