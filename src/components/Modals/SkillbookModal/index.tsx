import ForEach from "@/components/ForEach";
import { BaseModal } from "../BaseModal";

import { useMainStore } from "@/store/main";
import { Button } from "@/components/Button";

type Props = {
  isOpen?: boolean;
  onRequestClose: (i?: InventoryItem) => void;
};

export function SkillbookModal(props: Props) {
  const store = useMainStore();
  const allSkills = store.userCharacterData?.profession.skills;
  const learnedSkills = store.userCharacterData?.learnedSkills;
  const availableSkills = learnedSkills?.filter((l) => !l.equipped);
  const equippedSkills = learnedSkills?.filter((l) => l.equipped);
  const notLearnedSkills =
    allSkills?.filter(
      (skill) =>
        !learnedSkills?.some(
          (learnedSkill) => learnedSkill.skill.id === skill.id
        )
    ) || [];

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div>
        <span>Equipped skills</span>
        <ForEach
          items={equippedSkills}
          render={(equippedSkill) => (
            <Button
              theme="secondary"
              key={equippedSkill.id}
              label={
                <div>
                  <img src={equippedSkill.skill.image} />
                  <span>{equippedSkill.skill.name}</span>
                </div>
              }
            />
          )}
        />
      </div>
      <div>
        <span>Learned skills</span>
        <ForEach
          items={availableSkills}
          render={(learnedSkill) => (
            <Button
              key={learnedSkill.id}
              label={
                <div>
                  <img src={learnedSkill.skill.image} />
                  <span>{learnedSkill.skill.name}</span>
                </div>
              }
            />
          )}
        />
      </div>
      <div>
        <span>Not learned skills</span>
        <ForEach
          items={notLearnedSkills}
          render={(skill) => (
            <Button
              key={skill.id}
              label={
                <div>
                  <img src={skill.image} />
                  <span>{skill.name}</span>
                </div>
              }
            />
          )}
        />
      </div>
    </BaseModal>
  );
}
