import ForEach from "@/components/ForEach";
import styles from "./style.module.scss";
import { Button } from "@/components/Button";
import Clock from "@/assets/Clock";

type Props = {
  skills?: Skill[];
  disabled?: boolean;
  onClick: (skillId: number) => void;
};

export default function NotLearnedSkills({ skills, onClick, disabled }: Props) {
  return (
    <div className={styles.container}>
      <ForEach
        items={skills}
        render={(skill) => (
          <div className={styles.learnedSkillContainer}>
            <Button
              key={skill.id}
              disabled={disabled}
              onClick={() => onClick?.(skill.id)}
              label={
                <div className={styles.learnedSkillInfo}>
                  <div>
                    <img src={skill.image} />
                    <h3>{skill.name}</h3>
                  </div>

                  <span>{skill.description}</span>
                  <div>
                    <Clock />
                    <span>Cooldown {skill.cooldown}</span>
                    <img
                      width={25}
                      height={25}
                      src="https://kidmortal.sirv.com/misc/mana.webp"
                    />
                    <span>Mana {skill?.manaCost}</span>
                  </div>
                </div>
              }
            />
          </div>
        )}
      />
    </div>
  );
}
