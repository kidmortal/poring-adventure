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

export function ClassBlock({ characterClass, selected, selectedGender = 'male', onClick }: Props) {
  return (
    <div onClick={onClick} className={cn(styles.container, { [styles.selected]: selected })}>
      <div className={styles.classDetails}>
        <h3>{characterClass?.name}</h3>
        <ForEach items={characterClass?.skills} render={(s) => <SkillPreview key={s.id} skill={s} />} />
      </div>
      <div className={styles.classStatsContainer}>
        <div className={styles.classStats}>
          <Stat assetName="health" label={`+${characterClass?.health}`} />
          <Stat assetName="mana" label={`+${characterClass?.mana}`} />
          <Stat assetName="attack" label={`+${characterClass?.attack}`} />
          <Stat assetName="str" label={`+${characterClass?.str}`} />
          <Stat assetName="agi" label={`+${characterClass?.agi}`} />
          <Stat assetName="int" label={`+${characterClass?.int}`} />
        </div>
        <CharacterInfo gender={selectedGender} costume={characterClass?.costume ?? ''} head="1" />
      </div>
    </div>
  );
}

function SkillPreview({ skill }: { skill: Skill }) {
  return (
    <div className={styles.skillContainer}>
      <img src={skill.image} />
      <span>{skill.name}</span>
    </div>
  );
}
