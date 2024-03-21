import ForEach from "@/components/ForEach";
import styles from "./style.module.scss";
import { Button } from "@/components/Button";
import Clock from "@/assets/Clock";

type Props = {
  skills?: LearnedSkill[];
  disabled?: boolean;
  onClick: (skillId: number) => void;
};

export default function LearnedSkills({ skills, onClick, disabled }: Props) {
  return (
    <div className={styles.container}>
      <ForEach
        items={skills}
        render={(learnedSkill) => (
          <div className={styles.learnedSkillContainer}>
            <Button
              key={learnedSkill.id}
              disabled={disabled}
              onClick={() => onClick?.(learnedSkill.skillId)}
              label={
                <div className={styles.learnedSkillInfo}>
                  <div>
                    <img src={learnedSkill.skill.image} />
                    <h3>{learnedSkill.skill.name}</h3>
                  </div>

                  <span>{learnedSkill.skill.description}</span>
                  <div>
                    <Clock />
                    <span>Cooldown {learnedSkill.skill.cooldown}</span>
                    <img
                      width={25}
                      height={25}
                      src="https://kidmortal.sirv.com/misc/mana.webp"
                    />
                    <span>Mana {learnedSkill.skill?.manaCost}</span>
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
