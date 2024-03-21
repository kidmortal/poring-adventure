import { BaseModal } from "../BaseModal";

import { useMainStore } from "@/store/main";
import { useMutation } from "@tanstack/react-query";
import { useWebsocketApi } from "@/api/websocketServer";
import EquippedSkills from "./components/EquippedSkills";
import LearnedSkills from "./components/LearnedSkills";
import NotLearnedSkills from "./components/NotLearnedSkills";

type Props = {
  isOpen?: boolean;
  onRequestClose: (i?: InventoryItem) => void;
};

export function SkillbookModal(props: Props) {
  const api = useWebsocketApi();
  const store = useMainStore();
  const allSkills = store.userCharacterData?.profession?.skills;
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

  const learnSkillMutation = useMutation({
    mutationFn: (skillId: number) => api.skills.learnSkill(skillId),
  });

  const equipSkillMutation = useMutation({
    mutationFn: (skillId: number) => api.skills.equipSkill(skillId),
  });
  const unequipSkillMutation = useMutation({
    mutationFn: (skillId: number) => api.skills.unequipSkill(skillId),
  });

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <span>Equipped skills {equippedSkills?.length}/4</span>
      <EquippedSkills
        skills={equippedSkills}
        disabled={unequipSkillMutation.isPending}
        onClick={(id) => unequipSkillMutation.mutate(id)}
      />

      <span>Learned skills</span>
      <LearnedSkills
        skills={availableSkills}
        disabled={equipSkillMutation.isPending}
        onClick={(id) => equipSkillMutation.mutate(id)}
      />

      <span>Not learned skills</span>
      <NotLearnedSkills
        skills={notLearnedSkills}
        disabled={learnSkillMutation.isPending}
        onClick={(id) => learnSkillMutation.mutate(id)}
      />
    </BaseModal>
  );
}
