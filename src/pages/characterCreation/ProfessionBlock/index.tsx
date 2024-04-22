import { CharacterInfo } from '@/components/Character/CharacterInfo';
import styles from './style.module.scss';
import ForEach from '@/components/shared/ForEach';
import cn from 'classnames';
import { Stat } from '@/components/Character/CharacterStatsInfo';

type Props = {
  profession?: Profession;
  selectedGender?: 'male' | 'female';
  selected?: boolean;
  onClick?: () => void;
};

export function ProfessionBlock({ profession, selected, selectedGender = 'male', onClick }: Props) {
  return (
    <div onClick={onClick} className={cn(styles.container, { [styles.selected]: selected })}>
      <div className={styles.professionDetails}>
        <h3>{profession?.name}</h3>
        <ForEach items={profession?.skills} render={(s) => <SkillPreview key={s.id} skill={s} />} />
      </div>
      <div className={styles.professionStatsContainer}>
        <div className={styles.professionStats}>
          <Stat assetName="health" label={`+${profession?.health}`} />
          <Stat assetName="mana" label={`+${profession?.mana}`} />
          <Stat assetName="attack" label={`+${profession?.attack}`} />
          <Stat assetName="str" label={`+${profession?.str}`} />
          <Stat assetName="agi" label={`+${profession?.agi}`} />
          <Stat assetName="int" label={`+${profession?.int}`} />
        </div>
        <CharacterInfo gender={selectedGender} costume={profession?.costume ?? ''} head="1" />
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
