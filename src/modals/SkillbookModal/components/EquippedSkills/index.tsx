import ForEach from "@/components/ForEach";
import styles from "./style.module.scss";
import { Button } from "@/components/Button";

type Props = {
  skills?: LearnedSkill[];
  disabled?: boolean;
  onClick: (skillId: number) => void;
};

export default function EquippedSkills({ skills, onClick, disabled }: Props) {
  return (
    <div className={styles.container}>
      <ForEach
        items={skills}
        render={(equippedSkill) => (
          <Button
            theme="secondary"
            key={equippedSkill.id}
            disabled={disabled}
            onClick={() => onClick?.(equippedSkill.skillId)}
            label={<img src={equippedSkill.skill.image} />}
          />
        )}
      />
    </div>
  );
}
