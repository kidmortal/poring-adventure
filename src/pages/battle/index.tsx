import { useWebsocketApi } from "@/api/websocketServer";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { Query } from "@/store/query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/Button";
import { BattleMonsterInfo } from "./components/BattleMonsterInfo";
import { When } from "@/components/When";
import { BattleRewardBox } from "./components/BattleRewardsBox";
import { useBattleStore } from "@/store/battle";
import ForEach from "@/components/ForEach";
import { CharacterWithHealthBar } from "@/components/CharacterWithHealthBar";
import { BattleLogs } from "./components/BattleLogs";
import { BattleActions } from "./components/BattleActions";

function highestAggroUser(users: BattleUser[]) {
  let highestAggro = users[0];
  users.forEach((u) => {
    if (u.aggro && highestAggro.aggro) {
      if (u?.aggro > highestAggro?.aggro) {
        highestAggro = u;
      }
    }
  });
  return highestAggro;
}

export function BattlePage() {
  const store = useMainStore();
  const queryClient = useQueryClient();
  const battleStore = useBattleStore();
  const api = useWebsocketApi();
  const query = queryClient.getQueryState([Query.BATTLE]);

  const createBattleMutation = useMutation({
    mutationFn: () => api.battle.createBattleInstance(),
  });

  if (query?.status === "pending") {
    return <FullscreenLoading info="Battle Info" />;
  }
  const battle = battleStore.battle;
  const userIsInBattle = !!battle;
  const battleIsFinished = battle?.battleFinished || false;

  const userEmail = store.userCharacterData?.email ?? "";
  const userName = store.userCharacterData?.name ?? "";
  const turnIndex = battle?.attackerTurn ?? 0;
  const turnName = battle?.attackerList[turnIndex ?? 0];
  const isYourTurn = userName === turnName;
  const battleUser = battle?.users.find((u) => u.email === userEmail);
  const highestAggroPlayer = highestAggroUser(battle?.users ?? []);

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
                highestAggro={highestAggroPlayer.name === u.name}
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
