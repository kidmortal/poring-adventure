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
/**
 * What the class is, in one line.
 *
 * Every seeded class carries its own description and that is what shows. The
 * fallback is for a class seeded without one — rather than leave a blank line,
 * it reads the per-level stat block and says which two numbers are the tallest,
 * which is the honest summary anyway: what a class does here *is* what it grows.
 */
function describeClass(characterClass?: Class) {
  if (characterClass?.description) return characterClass.description;
  if (!characterClass) return '';

  const growth = [
    { label: 'health', value: characterClass.health / 5 },
    { label: 'mana', value: characterClass.mana / 5 },
    { label: 'attack', value: characterClass.attack },
    { label: 'armour', value: characterClass.defense ?? 0 },
    { label: 'strength', value: characterClass.str },
    { label: 'agility', value: characterClass.agi },
    { label: 'intelligence', value: characterClass.int },
  ]
    .filter((stat) => stat.value > 0)
    .sort((a, b) => b.value - a.value);

  if (growth.length === 0) return 'Grows nothing in particular — a blank slate.';
  const [first, second] = growth;
  return second ? `Grows mostly ${first.label} and ${second.label}.` : `Grows mostly ${first.label}.`;
}

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
          <p className={styles.description}>{describeClass(characterClass)}</p>
        </div>
      </div>

      {/* Under the description rather than beside it: sharing the row left the
          name a column two letters wide on a small phone. */}
      <div className={styles.stats} title="Gained per level">
        <Stat assetName="health" label={`+${characterClass?.health}`} />
        <Stat assetName="mana" label={`+${characterClass?.mana}`} />
        <Stat assetName="attack" label={`+${characterClass?.attack}`} />
        <Stat assetName="def" label={`+${characterClass?.defense ?? 0}`} />
        <Stat assetName="str" label={`+${characterClass?.str}`} />
        <Stat assetName="agi" label={`+${characterClass?.agi}`} />
        <Stat assetName="int" label={`+${characterClass?.int}`} />
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
