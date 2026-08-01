import { CharacterInfo } from '@/components/Character/CharacterInfo';
import styles from './style.module.scss';
import ForEach from '@/components/shared/ForEach';
import cn from 'classnames';
import { Stat } from '@/components/Character/CharacterStatsInfo';

type Props = {
  characterClass?: Class;
  selectedGender?: Gender;
  selected?: boolean;
  onClick?: () => void;
};

/**
 * One pickable class, compressed into a short card so several fit on a phone
 * screen: portrait, name, skill icons and the stat grid side by side.
 */
export function ClassBlock({ characterClass, selected, selectedGender = 'male', onClick }: Props) {
  return (
    <div onClick={onClick} className={cn(styles.container, { [styles.selected]: selected })}>
      <div className={styles.portrait}>
        <CharacterInfo gender={selectedGender} costume={characterClass?.costume ?? ''} head="1" />
      </div>

      <div className={styles.details}>
        <h3 className={styles.name}>{characterClass?.name}</h3>
        {/* Skills are icons with the name beneath — the old stack of full-width
            rows is what made the card tall enough to push classes off screen. */}
        <div className={styles.skills}>
          <ForEach items={characterClass?.skills} render={(s) => <SkillPreview key={s.id} skill={s} />} />
        </div>
      </div>

      <div className={styles.stats}>
        <Stat assetName="health" label={`+${characterClass?.health}`} />
        <Stat assetName="mana" label={`+${characterClass?.mana}`} />
        <Stat assetName="attack" label={`+${characterClass?.attack}`} />
        <Stat assetName="str" label={`+${characterClass?.str}`} />
        <Stat assetName="agi" label={`+${characterClass?.agi}`} />
        <Stat assetName="int" label={`+${characterClass?.int}`} />
      </div>
    </div>
  );
}

function SkillPreview({ skill }: { skill: Skill }) {
  return (
    <div className={styles.skill} title={skill.name}>
      <img src={skill.image} alt={skill.name} />
      <span>{skill.name}</span>
    </div>
  );
}
