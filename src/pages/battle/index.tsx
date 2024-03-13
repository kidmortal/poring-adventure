import { useWebsocketApi } from "@/api/websocketServer";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { Query } from "@/store/query";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Button } from "@/components/Button";
import { BattleMonsterInfo } from "./components/BattleMonsterInfo";
import { When } from "@/components/When";
import { BattleRewardBox } from "./components/BattleRewardsBox";
import { useBattleStore } from "@/store/battle";
import ForEach from "@/components/ForEach";
import { CharacterWithHealthBar } from "@/components/CharacterWithHealthBar";

export function BattlePage() {
  const store = useMainStore();
  const battleStore = useBattleStore();
  const api = useWebsocketApi();
  const query = useQuery({
    queryKey: [Query.BATTLE],
    enabled: !!store.websocket && !!store.loggedUserInfo.accessToken,
    staleTime: 1000 * 2,
    queryFn: () => api.battle.getBattleInstance(),
  });

  const createBattleMutation = useMutation({
    mutationFn: () => api.battle.createBattleInstance(),
  });

  const attackMutation = useMutation({
    mutationFn: () => api.battle.requestBattleAttack(),
  });

  const cancelBattleMutation = useMutation({
    mutationFn: () => api.battle.cancelBattleInstance(),
  });

  if (query.isLoading) {
    return <FullscreenLoading info="Battle Info" />;
  }
  const userIsInBattle = !!battleStore.battle;
  const battleIsFinished =
    userIsInBattle && !battleStore.battle?.battleFinished;

  const turnIndex = battleStore.battle?.attackerTurn;

  return (
    <div className={styles.container}>
      <When value={!userIsInBattle}>
        <div className={styles.noBattleContainer}>
          <Button
            label="Search monster"
            onClick={() => createBattleMutation.mutate()}
            disabled={createBattleMutation.isPending}
          />
        </div>
      </When>
      <When value={userIsInBattle}>
        <div className={styles.turnLabelContainer}>
          Turn: {battleStore.battle?.attackerList[turnIndex ?? 0]}
        </div>

        <div className={styles.logContainer}>
          {battleStore.battle?.log?.map((log) => (
            <div>
              <When value={!!log.icon}>
                <img
                  width={15}
                  height={15}
                  src={`https://kidmortal.sirv.com/skills/${log.icon}.webp`}
                />
              </When>
              <span key={`${log}${crypto.randomUUID()}`}>{log.message}</span>
            </div>
          ))}
        </div>
        <div className={styles.monsterSection}>
          <When value={userIsInBattle}>
            <When value={!!battleIsFinished}>
              <ForEach
                items={battleStore.battle?.monsters}
                render={(m) => (
                  <BattleMonsterInfo
                    key={`${m.name}-${crypto.randomUUID()}`}
                    monster={m}
                  />
                )}
              />
            </When>
            <When value={!battleIsFinished}>
              <BattleRewardBox
                drops={battleStore.battle?.drops}
                userLost={battleStore.battle?.userLost}
                members={battleStore.battle?.users}
              />
            </When>
          </When>
        </div>
        <div className={styles.userSection}>
          <ForEach
            items={battleStore.battle?.users}
            render={(u) => (
              <CharacterWithHealthBar
                orientation="back"
                key={u.email}
                user={u}
              />
            )}
          />
        </div>

        <div className={styles.actions}>
          <Button
            label="Attack"
            onClick={() => attackMutation.mutate()}
            disabled={attackMutation.isPending || query.isRefetching}
          />
          <Button
            label="End Battle"
            theme="danger"
            onClick={() => cancelBattleMutation.mutate()}
            disabled={cancelBattleMutation.isPending || query.isRefetching}
          />
        </div>
      </When>

      {/* <div className={styles.skills}>
        <div>
          <Button
            label={
              <div>
                <img
                  width={15}
                  height={15}
                  src="https://cdn.discordapp.com/emojis/646881350267305994.webp?size=96&quality=lossless"
                />
                <span>Fireball</span>
              </div>
            }
          />
        </div>
        <div>
          <Button
            label={
              <div>
                <img
                  width={15}
                  height={15}
                  src="https://cdn.discordapp.com/emojis/662327427049193475.webp?size=96&quality=lossless"
                />
                <span>Ice Shards</span>
              </div>
            }
          />
        </div>
      </div> */}
    </div>
  );
}
