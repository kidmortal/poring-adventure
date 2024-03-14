import { Button } from "@/components/Button";
import styles from "./style.module.scss";
import { useMutation } from "@tanstack/react-query";
import { WebsocketApi } from "@/api/websocketServer";
import { useState } from "react";
import cn from "classnames";
import { When } from "@/components/When";
import ForEach from "@/components/ForEach";

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
                label={
                  <SkillText
                    asset={equippedSkill.skill.image}
                    name={equippedSkill.skill.name}
                  />
                }
                onClick={() => {
                  castMutation.mutate(equippedSkill.skillId);
                  setIsCasting(false);
                }}
                disabled={
                  castMutation.isPending ||
                  (user?.stats?.mana ?? 0) < equippedSkill.skill.manaCost
                }
              />
            )}
          />
        </div>
      </When>
    </div>
  );
}

function SkillText(args: { name: string; asset: string }) {
  return (
    <div className={styles.skillText}>
      <img width={20} height={20} src={args.asset} />
      {/* <span>{args.name}</span> */}
    </div>
  );
}
