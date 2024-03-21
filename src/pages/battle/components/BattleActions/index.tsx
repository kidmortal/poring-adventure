import { Button } from "@/components/Button";
import styles from "./style.module.scss";
import { useMutation } from "@tanstack/react-query";
import { WebsocketApi } from "@/api/websocketServer";
import { useState } from "react";
import cn from "classnames";
import { When } from "@/components/When";
import ForEach from "@/components/ForEach";
import Clock from "@/assets/Clock";

type Props = {
  api: WebsocketApi;
  user?: User;
  isYourTurn?: boolean;
  battleEnded: boolean;
};

export function BattleActions({ api, isYourTurn, battleEnded, user }: Props) {
  const equippedSkills = user?.learnedSkills.filter((skill) => skill.equipped);
  const [isCasting, setIsCasting] = useState(false);

  const attackMutation = useMutation({
    mutationFn: () => api.battle.requestBattleAttack(),
  });

  const castMutation = useMutation({
    mutationFn: (skillId: number) => api.battle.requestBattleCast(skillId),
  });

  const cancelBattleMutation = useMutation({
    mutationFn: () => api.battle.cancelBattleInstance(),
  });

  const currentMana = user?.stats?.mana ?? 0;
  return (
    <div className={styles.actions}>
      <When value={battleEnded}>
        <Button
          label="Finish battle"
          theme="primary"
          onClick={() => cancelBattleMutation.mutate()}
          disabled={cancelBattleMutation.isPending}
        />
      </When>
      <When value={!battleEnded}>
        <Button
          label="Attack"
          onClick={() => attackMutation.mutate()}
          disabled={attackMutation.isPending || !isYourTurn || isCasting}
        />
        <Button
          label={isCasting ? "Cancel" : "Cast"}
          theme={isCasting ? "danger" : "secondary"}
          onClick={() => {
            setIsCasting(!isCasting);
          }}
          disabled={cancelBattleMutation.isPending || !isYourTurn}
        />
        <Button
          label="Run"
          theme="danger"
          onClick={() => cancelBattleMutation.mutate()}
          disabled={cancelBattleMutation.isPending || !isYourTurn || isCasting}
        />
        <div
          className={cn(styles.skillsContainer, {
            [styles.visible]: isCasting,
          })}
        >
          <When value={equippedSkills?.length === 0}>
            <Button label="You have no learned skills" disabled />
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
                  castMutation.mutate(equippedSkill.skillId);
                  setIsCasting(false);
                  console.log({
                    mana: user?.stats?.mana,
                    cost: equippedSkill.skill.manaCost,
                  });
                }}
                disabled={
                  castMutation.isPending ||
                  currentMana < equippedSkill.skill.manaCost ||
                  equippedSkill.cooldown > 0
                }
              />
            )}
          />
        </div>
      </When>
    </div>
  );
}

function SkillText(args: { learnedSkill: LearnedSkill }) {
  const skill = args.learnedSkill?.skill;
  return (
    <div className={styles.skillText}>
      <img height={30} width={30} src={skill.image} />
      <div className={styles.skillInfo}>
        <div className={styles.skillInfoRow}>
          <img
            width={20}
            height={20}
            src="https://kidmortal.sirv.com/misc/mana.webp"
          />
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
