import { useState } from 'react';
import { Button } from '@/components/shared/Button';
import styles from './style.module.scss';
import { useMutation } from '@tanstack/react-query';
import { WebsocketApi } from '@/api/websocketServer';
import cn from 'classnames';
import { When } from '@/components/shared/When';
import ForEach from '@/components/shared/ForEach';
import Clock from '@/assets/Clock';
import { FaBolt, FaFistRaised, FaFlag, FaFlask, FaMagic, FaTimes } from 'react-icons/fa';
import { useBattleStore } from '@/store/battle';
import { useUserStore } from '@/store/user';
import { needsAllyTarget } from '@/modals/SkillbookModal/skillInfo';

type Props = {
  api: WebsocketApi;
  user?: User;
  isYourTurn?: boolean;
};

/** Only rendered mid fight — a finished battle is handled by BattleResults. */
export function BattleActions({ api, isYourTurn, user }: Props) {
  const battleStore = useBattleStore();
  const userStore = useUserStore();
  const equippedSkills = user?.learnedSkills.filter((skill) => skill.equipped);
  const [showingItems, setShowingItems] = useState(false);

  // Only the alchemist's line works under pressure. Food is deliberately left
  // out: a meal is something you eat before walking in, and letting it be eaten
  // mid-fight would make the cook a worse alchemist instead of a different job.
  const battleItems = (user?.inventory ?? []).filter(
    (entry) => entry.item.battleUse && !entry.equipped && !entry.marketListing,
  );

  const attackMutation = useMutation({
    mutationFn: () => api.battle.requestBattleAttack(),
  });

  const castMutation = useMutation({
    mutationFn: (params: { skillId: number; targetName?: string }) => api.battle.requestBattleCast(params),
  });

  const cancelBattleMutation = useMutation({
    mutationFn: () => api.battle.cancelBattleInstance(),
  });

  const useItemMutation = useMutation({
    mutationFn: (inventoryId: number) => api.battle.requestBattleUseItem({ inventoryId }),
    // It cost the turn either way, so the tray closes rather than inviting a
    // second click that the server would only refuse.
    onSettled: () => setShowingItems(false),
  });

  const currentMana = user?.stats?.mana ?? 0;
  // Running ends the fight for everyone, so the leader may call it at any point
  // — the server holds the same rule.
  const leadsParty = !!userStore.party && userStore.party.leaderEmail === userStore.user?.email;
  const canRun = (isYourTurn || leadsParty) && !battleStore.isCasting;
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
          setShowingItems(false);
        }}
        disabled={cancelBattleMutation.isPending || !isYourTurn}
      />
      {/* Drinking costs the turn, which is the trade against bringing a Priest:
          a party without one can buy a heal, and pay for it in tempo. */}
      <Button
        className={styles.actionButton}
        label={
          <span className={styles.actionLabel}>
            {showingItems ? <FaTimes /> : <FaFlask />}
            {showingItems ? 'Close' : 'Item'}
          </span>
        }
        theme={showingItems ? 'danger' : 'secondary'}
        onClick={() => {
          setShowingItems(!showingItems);
          battleStore.setIsCasting(false);
          battleStore.setIsTargetingSkill(false);
          battleStore.setSkillId(undefined);
        }}
        disabled={useItemMutation.isPending || !isYourTurn}
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
        disabled={cancelBattleMutation.isPending || !canRun}
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
                // Only a single-target ally skill waits for a pick. A party heal
                // or a blessing reaches everyone, so asking who to point it at
                // would be a click that changes nothing.
                if (needsAllyTarget(equippedSkill.skill)) {
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

      <div className={cn(styles.skillsContainer, { [styles.visible]: showingItems })}>
        <When value={battleItems.length === 0}>
          <Button
            label={
              <span className={styles.actionLabel}>
                <FaFlask /> Nothing to drink
              </span>
            }
            disabled
          />
        </When>
        <ForEach
          items={battleItems}
          render={(entry) => (
            <Button
              key={entry.id}
              className={styles.skillButton}
              theme="secondary"
              label={<BattleItemText inventoryItem={entry} />}
              onClick={() => useItemMutation.mutate(entry.id)}
              disabled={useItemMutation.isPending}
            />
          )}
        />
      </div>
    </div>
  );
}

/** The sprite, how many are left, and the quality that decides how much it does. */
function BattleItemText({ inventoryItem }: { inventoryItem: InventoryItem }) {
  return (
    <div className={styles.skillText}>
      <img height={25} width={25} src={inventoryItem.item.image} alt={inventoryItem.item.name} />
      <div className={styles.skillInfo}>
        <span>x{inventoryItem.stack}</span>
        <When value={inventoryItem.quality > 1}>
          <span className={styles.itemQuality}>Q{inventoryItem.quality}</span>
        </When>
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
