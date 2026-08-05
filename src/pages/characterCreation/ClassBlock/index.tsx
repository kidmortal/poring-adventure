import { CharacterInfo } from '@/components/Character/CharacterInfo';
import styles from './style.module.scss';
import ForEach from '@/components/shared/ForEach';
import cn from 'classnames';
import { Stat } from '@/components/Character/CharacterStatsInfo';
import { useModalStore } from '@/store/modal';

type Props = {
  characterClass?: Class;
  selectedGender?: Gender;
  selected?: boolean;
  onClick?: () => void;
};

/**
 * One pickable class, compressed into a short card so several fit on a phone
 * screen: portrait, name and the per-level stat block on one row, with the
 * skills as a strip of icons underneath.
 *
 * The icons carried their names before, which cost a row of text for every
 * three skills — a Priest's sixteen filled the screen on its own, and two
 * classes could not be compared without scrolling between them. The name now
 * lives in the preview a tap opens, along with the numbers the player is
 * actually choosing between.
 */
export function ClassBlock({ characterClass, selected, selectedGender = 'male', onClick }: Props) {
  const modalStore = useModalStore();

  // Ordered by unlock, so the strip reads as the class's progression rather
  // than as whatever order the seed happened to write.
  const skills = [...(characterClass?.skills ?? [])].sort((a, b) => a.requiredLevel - b.requiredLevel);

  return (
    <div onClick={onClick} className={cn(styles.container, { [styles.selected]: selected })}>
      <div className={styles.head}>
        <div className={styles.portrait}>
          <CharacterInfo gender={selectedGender} costume={characterClass?.costume ?? ''} head="1" />
        </div>

        <div className={styles.details}>
          <h3 className={styles.name}>{characterClass?.name}</h3>
          <span className={styles.hint}>Per level · tap a skill to read it</span>
        </div>

        <div className={styles.stats}>
          <Stat assetName="health" label={`+${characterClass?.health}`} />
          <Stat assetName="mana" label={`+${characterClass?.mana}`} />
          <Stat assetName="attack" label={`+${characterClass?.attack}`} />
          <Stat assetName="def" label={`+${characterClass?.defense ?? 0}`} />
          <Stat assetName="str" label={`+${characterClass?.str}`} />
          <Stat assetName="agi" label={`+${characterClass?.agi}`} />
          <Stat assetName="int" label={`+${characterClass?.int}`} />
        </div>
      </div>

      <div className={styles.skills}>
        <ForEach
          items={skills}
          render={(skill) => (
            <button
              key={skill.id}
              type="button"
              className={styles.skill}
              title={skill.name}
              // The card underneath is the class picker, so reading a skill
              // must not also pick the class it belongs to.
              onClick={(event) => {
                event.stopPropagation();
                modalStore.setSkillInfo({ open: true, skill, className: characterClass?.name });
              }}
            >
              <img src={skill.image} alt={skill.name} />
              <span className={styles.skillLevel}>{skill.requiredLevel}</span>
            </button>
          )}
        />
      </div>
    </div>
  );
}
