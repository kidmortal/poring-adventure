import { CharacterInfo } from "@/components/CharacterInfo";
import styles from "./style.module.scss";
import ForEach from "@/components/ForEach";
import cn from "classnames";

type Props = {
  profession?: Profession;
  selectedGender?: "male" | "female";
  selected?: boolean;
  onClick?: () => void;
};

export function ProfessionBlock({
  profession,
  selected,
  selectedGender = "male",
  onClick,
}: Props) {
  return (
    <div
      onClick={onClick}
      className={cn(styles.container, { [styles.selected]: selected })}
    >
      <div className={styles.professionDetails}>
        <h3>{profession?.name}</h3>
        <ForEach
          items={profession?.skills}
          render={(s) => <SkillPreview key={s.id} skill={s} />}
        />
      </div>
      <CharacterInfo
        gender={selectedGender}
        costume={profession?.costume ?? ""}
        head="1"
      />
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
