import cn from 'classnames';
import styles from './style.module.scss';

import { BaseModal } from '../BaseModal';
import { When } from '@/components/shared/When';
import Clock from '@/assets/Clock';
import { skillKind, skillKindLabel, skillScaling, skillTargetLabel } from '../SkillbookModal/skillInfo';

type Props = {
  isOpen?: boolean;
  skill?: Skill;
  /** The class the skill was opened from, so the sheet says whose it is. */
  className?: string;
  onRequestClose: () => void;
};

/**
 * A skill read on its own, with nothing to do to it — what character creation
 * needs, where the player owns no skills yet and is only deciding which class
 * to be. `SkillCard` is the version with a Learn/Equip button attached; this is
 * the same information without a promise it cannot keep here.
 */
export function SkillInfoModal({ isOpen, skill, className, onRequestClose }: Props) {
  const kind = skillKind(skill);
  // No mastery to fold in: nobody owns this skill at the point it is previewed.
  const scaling = skillScaling(skill);

  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <header className={styles.header}>
        <img className={styles.icon} src={skill?.image} alt={skill?.name} />
        <div className={styles.identity}>
          <h2 className={styles.name}>{skill?.name}</h2>
          <When value={!!className}>
            <span className={styles.owner}>{className}</span>
          </When>
          <div className={styles.tags}>
            <span className={cn(styles.kind, styles[kind])}>{skillKindLabel(skill)}</span>
            <span className={styles.target}>{skillTargetLabel(skill)}</span>
          </div>
        </div>
      </header>

      <p className={styles.description}>{skill?.description}</p>

      <div className={styles.chips}>
        <span className={styles.chip} title="Mana cost">
          <img width={14} height={14} src="https://kidmortal.sirv.com/misc/mana.webp?w=14&h=14" />
          {skill?.manaCost}
        </span>
        <span className={styles.chip} title="Cooldown in turns">
          <Clock />
          {skill?.cooldown}
        </span>
        <When value={!!scaling}>
          <span className={cn(styles.chip, styles.scaling)} title="Potency at mastery 1">
            {scaling}
          </span>
        </When>
        <span className={styles.chip} title="Level it unlocks at">
          Lv {skill?.requiredLevel}
        </span>
      </div>

      <When value={!!skill?.buff || !!skill?.debuff}>
        <section className={styles.section}>
          <span className={styles.sectionTitle}>Leaves behind</span>
          <When value={!!skill?.buff}>
            <div className={styles.effectRow}>
              <span className={styles.effectName}>{skill?.buff?.name}</span>
              <span className={styles.effectDuration}>{skill?.buff?.duration} battles</span>
            </div>
          </When>
          <When value={!!skill?.debuff}>
            <div className={styles.effectRow}>
              <span className={styles.effectName}>{skill?.debuff?.name}</span>
              <span className={styles.effectDuration}>{skill?.debuff?.duration} turns</span>
            </div>
          </When>
        </section>
      </When>
    </BaseModal>
  );
}
