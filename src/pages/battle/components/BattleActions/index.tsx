import { Button } from '@/components/shared/Button';
import styles from './style.module.scss';
import { useMutation } from '@tanstack/react-query';
import { WebsocketApi } from '@/api/websocketServer';
import cn from 'classnames';
import { When } from '@/components/shared/When';
import ForEach from '@/components/shared/ForEach';
import Clock from '@/assets/Clock';
import { FaBolt, FaFistRaised, FaFlag, FaMagic, FaTimes } from 'react-icons/fa';
import { useBattleStore } from '@/store/battle';

type Props = {
  api: WebsocketApi;
  user?: User;
  isYourTurn?: boolean;
};

/** Only rendered mid fight — a finished battle is handled by BattleResults. */
export function BattleActions({ api, isYourTurn, user }: Props) {
  const battleStore = useBattleStore();
  const equippedSkills = user?.learnedSkills.filter((skill) => skill.equipped);

  const attackMutation = useMutation({
    mutationFn: () => api.battle.requestBattleAttack(),
  });

  const castMutation = useMutation({
    mutationFn: (params: { skillId: number; targetName?: string }) => api.battle.requestBattleCast(params),
  });

  const cancelBattleMutation = useMutation({
    mutationFn: () => api.battle.cancelBattleInstance(),
  });

  const currentMana = user?.stats?.mana ?? 0;
  return (
    <div className={styles.actions}>
      {/* Three verbs, three icons: at a glance, even mid fight. */}
      <Button
        className={styles.actionButton}
        label={
          <span className={styles.actionLabel}>
            <FaFistRaised /> Attack
          </span>
        }
        onClick={() => attackMutation.mutate()}
        disabled={attackMutation.isPending || !isYourTurn || battleStore.isCasting}
      />
      <Button
        className={styles.actionButton}
        label={
          <span className={styles.actionLabel}>
            {battleStore.isCasting ? <FaTimes /> : <FaMagic />}
            {battleStore.isCasting ? 'Cancel' : 'Cast'}
          </span>
        }
        theme={battleStore.isCasting ? 'danger' : 'secondary'}
        onClick={() => {
          battleStore.setIsCasting(!battleStore.isCasting);
          battleStore.setIsTargetingSkill(false);
          battleStore.setSkillId(undefined);
        }}
        disabled={cancelBattleMutation.isPending || !isYourTurn}
      />
      <Button
        className={styles.actionButton}
        label={
          <span className={styles.actionLabel}>
            <FaFlag /> Run
          </span>
        }
        theme="danger"
        onClick={() => cancelBattleMutation.mutate()}
        disabled={cancelBattleMutation.isPending || !isYourTurn || battleStore.isCasting}
      />
      <div
        className={cn(styles.skillsContainer, {
          [styles.visible]: battleStore.isCasting,
        })}
      >
        <When value={equippedSkills?.length === 0}>
          <Button
            label={
              <span className={styles.actionLabel}>
                <FaBolt /> No skills equipped
              </span>
            }
            disabled
          />
        </When>
        <ForEach
          items={equippedSkills}
          render={(equippedSkill) => (
            <Button
              key={equippedSkill.skillId}
              className={styles.skillButton}
              theme="secondary"
              label={<SkillText learnedSkill={equippedSkill} />}
              onClick={() => {
                if (equippedSkill.skill.category === 'target_ally') {
                  if (battleStore.isTargetingSkill) {
                    castMutation.mutate({
                      skillId: equippedSkill.skillId,
                    });
                    battleStore.setIsCasting(false);
                    battleStore.setIsTargetingSkill(false);
                    battleStore.setSkillId(undefined);
                    return;
                  }

                  battleStore.setIsTargetingSkill(true);
                  battleStore.setSkillId(equippedSkill.skillId);
                  return;
                }

                castMutation.mutate({
                  skillId: equippedSkill.skillId,
                });
                battleStore.setIsCasting(false);
              }}
              disabled={
                castMutation.isPending ||
                currentMana < equippedSkill.skill.manaCost ||
                equippedSkill.cooldown > 0 ||
                (battleStore.skillId != undefined && battleStore.skillId != equippedSkill.skillId)
              }
            />
          )}
        />
      </div>
    </div>
  );
}

function SkillText(args: { learnedSkill: LearnedSkill }) {
  const skill = args.learnedSkill?.skill;
  return (
    <div className={styles.skillText}>
      <img height={25} width={25} src={skill.image} />
      <div className={styles.skillInfo}>
        <div className={styles.skillInfoRow}>
          <img width={15} height={15} src="https://kidmortal.sirv.com/misc/mana.webp" />
          <span>{skill?.manaCost}</span>
        </div>
        <div
          className={cn(styles.skillInfoRow, {
            [styles.skillOnCooldown]: args.learnedSkill.cooldown > 0,
          })}
        >
          <Clock />
          <span>{args.learnedSkill?.cooldown}</span>
        </div>
      </div>
    </div>
  );
}
