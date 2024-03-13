import { Button } from "@/components/Button";
import styles from "./style.module.scss";
import { useMutation } from "@tanstack/react-query";
import { WebsocketApi } from "@/api/websocketServer";
import { useState } from "react";
import cn from "classnames";
import { toast } from "react-toastify";
import { When } from "@/components/When";

type Props = {
  api: WebsocketApi;
  isYourTurn?: boolean;
  battleEnded: boolean;
};

export function BattleActions({ api, isYourTurn, battleEnded }: Props) {
  const [isCasting, setIsCasting] = useState(false);

  const attackMutation = useMutation({
    mutationFn: () => api.battle.requestBattleAttack(),
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
          <Button
            label={<SkillText asset="fireball" name="Fire" />}
            onClick={() => toast("Not implemented")}
          />
          <Button
            label={<SkillText asset="ice_shards" name="Ice" />}
            onClick={() => toast("Not implemented")}
          />
          <Button
            label={<SkillText asset="healing" name="Heal" />}
            onClick={() => toast("Not implemented")}
          />
        </div>{" "}
      </When>
    </div>
  );
}

function SkillText(args: { name: string; asset: string }) {
  return (
    <div className={styles.skillText}>
      <img
        width={20}
        height={20}
        src={`https://kidmortal.sirv.com/skills/${args.asset}.webp`}
      />
      <span>{args.name}</span>
    </div>
  );
}
