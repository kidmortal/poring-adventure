import { useMutation } from '@tanstack/react-query';

import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import EquippedSkills from './components/EquippedSkills';
import { SkillCard } from './components/SkillCard';
import ForEach from '@/components/shared/ForEach';
import { When } from '@/components/shared/When';
import { useWebsocketApi } from '@/api/websocketServer';
import { useUserStore } from '@/store/user';

type Props = {
  isOpen?: boolean;
  onRequestClose: (i?: InventoryItem) => void;
};

/** Battle only reads the equipped skills, and only four of them. */
const SKILL_SLOTS = 4;

export function SkillbookModal(props: Props) {
  const api = useWebsocketApi();
  const userStore = useUserStore();

  const user = userStore.user;
  const level = user?.stats?.level ?? 1;
  const allSkills = user?.class?.skills;
  const learnedSkills = user?.learnedSkills;
  const availableSkills = learnedSkills?.filter((l) => !l.equipped) ?? [];
  const equippedSkills = learnedSkills?.filter((l) => l.equipped) ?? [];
  const notLearnedSkills =
    allSkills?.filter((skill) => !learnedSkills?.some((learnedSkill) => learnedSkill.skill.id === skill.id)) ?? [];

  const learnSkillMutation = useMutation({
    mutationFn: (skillId: number) => api.skills.learnSkill(skillId),
  });

  const equipSkillMutation = useMutation({
    mutationFn: (skillId: number) => api.skills.equipSkill(skillId),
  });
  const unequipSkillMutation = useMutation({
    mutationFn: (skillId: number) => api.skills.unequipSkill(skillId),
  });

  const slotsFull = equippedSkills.length >= SKILL_SLOTS;

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <header className={styles.header}>
        <img className={styles.book} src="https://kidmortal.sirv.com/misc/skillbook.webp?w=32&h=32" />
        <div className={styles.headerText}>
          <h2 className={styles.title}>Skillbook</h2>
          <span className={styles.subtitle}>
            {user?.class?.name ?? 'No class'} · Lv {level}
          </span>
        </div>
      </header>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTitle}>Equipped</span>
          <span className={styles.count}>
            {equippedSkills.length}/{SKILL_SLOTS}
          </span>
        </div>
        <EquippedSkills
          skills={equippedSkills}
          slots={SKILL_SLOTS}
          disabled={unequipSkillMutation.isPending}
          onClick={(id) => unequipSkillMutation.mutate(id)}
        />
        <When value={equippedSkills.length > 0}>
          <span className={styles.hint}>Tap a skill to take it out of your bar.</span>
        </When>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTitle}>Learned</span>
          <span className={styles.count}>{availableSkills.length}</span>
        </div>
        <When value={availableSkills.length === 0}>
          <span className={styles.empty}>Everything you know is equipped.</span>
        </When>
        <div className={styles.list}>
          <ForEach
            items={availableSkills}
            render={(learnedSkill) => (
              <SkillCard
                key={learnedSkill.id}
                skill={learnedSkill.skill}
                masteryLevel={learnedSkill.masteryLevel}
                action="Equip"
                blockedReason={slotsFull ? 'Bar is full' : undefined}
                disabled={equipSkillMutation.isPending}
                onClick={() => equipSkillMutation.mutate(learnedSkill.skillId)}
              />
            )}
          />
        </div>
      </section>

      <section className={styles.section}>
        <div className={styles.sectionHead}>
          <span className={styles.sectionTitle}>Not learned</span>
          <span className={styles.count}>{notLearnedSkills.length}</span>
        </div>
        <When value={notLearnedSkills.length === 0}>
          <span className={styles.empty}>You have learned every skill of your class.</span>
        </When>
        <div className={styles.list}>
          <ForEach
            items={notLearnedSkills}
            render={(skill) => (
              <SkillCard
                key={skill.id}
                skill={skill}
                locked
                action="Learn"
                blockedReason={level < skill.requiredLevel ? `Needs Lv ${skill.requiredLevel}` : undefined}
                disabled={learnSkillMutation.isPending}
                onClick={() => learnSkillMutation.mutate(skill.id)}
              />
            )}
          />
        </div>
      </section>
    </BaseModal>
  );
}
