import { Button } from "@/components/Button";
import styles from "./style.module.scss";
import { useMutation } from "@tanstack/react-query";
import { WebsocketApi } from "@/api/websocketServer";
import { useState } from "react";
import cn from "classnames";
import { toast } from "react-toastify";

type Props = {
  api: WebsocketApi;
  isYourTurn?: boolean;
};

export function BattleActions({ api, isYourTurn }: Props) {
  const [isCasting, setIsCasting] = useState(false);

  const attackMutation = useMutation({
    mutationFn: () => api.battle.requestBattleAttack(),
  });

  const cancelBattleMutation = useMutation({
    mutationFn: () => api.battle.cancelBattleInstance(),
  });

  return (
    <div className={styles.actions}>
      <Button
        label="Attack"
        onClick={() => attackMutation.mutate()}
        disabled={attackMutation.isPending || !isYourTurn}
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
        disabled={cancelBattleMutation.isPending || !isYourTurn}
      />
      <div
        className={cn(styles.skillsContainer, { [styles.visible]: isCasting })}
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
      </div>
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
