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
import { BattleLogs } from "./components/BattleLogs";
import { BattleActions } from "./components/BattleActions";

export function BattlePage() {
  const store = useMainStore();
  const battleStore = useBattleStore();
  const api = useWebsocketApi();
  const query = useQuery({
    queryKey: [Query.BATTLE],
    enabled: !!store.websocket && !!store.loggedUserInfo.accessToken,
    staleTime: 1000 * 60, // 60 seconds
    queryFn: () => api.battle.getBattleInstance(),
  });

  const createBattleMutation = useMutation({
    mutationFn: () => api.battle.createBattleInstance(),
  });

  if (query.isLoading) {
    return <FullscreenLoading info="Battle Info" />;
  }
  const userIsInBattle = !!battleStore.battle;
  const battleIsFinished = battleStore.battle?.battleFinished || false;

  const userEmail = store.userCharacterData?.email ?? "";
  const userName = store.userCharacterData?.name ?? "";
  const turnIndex = battleStore.battle?.attackerTurn ?? 0;
  const turnName = battleStore.battle?.attackerList[turnIndex ?? 0];
  const isYourTurn = userName === turnName;
  const battleUser = battleStore.battle?.users.find(
    (u) => u.email === userEmail
  );

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
          <BattleLogs logs={battleStore.battle?.log} />
        </div>
        <div className={styles.monsterSection}>
          <When value={userIsInBattle}>
            <When value={!battleIsFinished}>
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
            <When value={battleIsFinished}>
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
        <BattleActions
          user={battleUser}
          api={api}
          isYourTurn={isYourTurn}
          battleEnded={battleIsFinished}
        />
      </When>
    </div>
  );
}
