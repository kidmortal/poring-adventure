import { useWebsocketApi } from '@/api/websocketServer';
import { FullscreenLoading } from '@/layout/PageLoading/FullscreenLoading';
import styles from './style.module.scss';
import { Query } from '@/store/query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BattleMonsterInfo } from './components/BattleMonsterInfo';
import { When } from '@/components/shared/When';
import { BattleRewardBox } from './components/BattleRewardsBox';
import { useBattleStore } from '@/store/battle';
import ForEach from '@/components/shared/ForEach';
import { CharacterWithHealthBar } from '@/components/Character/CharacterWithHealthBar';
import { BattleLogs } from './components/BattleLogs';
import { BattleActions } from './components/BattleActions';
import MapInfo from './components/MapInfo';
import { useUserStore } from '@/store/user';

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
  const userStore = useUserStore();
  const queryClient = useQueryClient();
  const battleStore = useBattleStore();
  const api = useWebsocketApi();
  const query = queryClient.getQueryState([Query.BATTLE]);
  const maps = queryClient.getQueryState<MonsterMap[]>([Query.MAPS]);

  const castMutation = useMutation({
    mutationFn: (params: { skillId: number; targetName?: string }) => api.battle.requestBattleCast(params),
  });

  console.log(maps?.data);

  if (query?.status === 'pending') {
    return <FullscreenLoading info="Battle Info" />;
  }
  const battle = battleStore.battle;
  const userIsInBattle = !!battle;
  const battleIsFinished = battle?.battleFinished || false;

  const userEmail = userStore.user?.email ?? '';
  const userName = userStore.user?.name ?? '';
  const turnIndex = battle?.attackerTurn ?? 0;
  const turnName = battle?.attackerList[turnIndex ?? 0];
  const isYourTurn = userName === turnName;
  const battleUser = battle?.users.find((u) => u.email === userEmail);
  const highestAggroPlayer = highestAggroUser(battle?.users ?? []);

  return (
    <div className={styles.container}>
      <When value={!userIsInBattle}>
        <div className={styles.noBattleContainer}>
          <h2>Select map</h2>
          <ForEach items={maps?.data} render={(m) => <MapInfo key={m.id} map={m} />} />
        </div>
      </When>
      <When value={userIsInBattle}>
        <div className={styles.turnLabelContainer}>Turn: {battleStore.battle?.attackerList[turnIndex ?? 0]}</div>

        <div className={styles.logContainer}>
          <BattleLogs logs={battleStore.battle?.log} />
        </div>
        <div className={styles.monsterSection}>
          <When value={userIsInBattle}>
            <When value={!battleIsFinished}>
              <ForEach
                items={battleStore.battle?.monsters}
                render={(m, idx) => <BattleMonsterInfo key={`${m.name}-${idx}`} monster={m} />}
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
          <When value={battleStore.isTargetingSkill}>
            <h2 className={styles.targetingSkillLabel}>Click on Ally or press again to auto-choose</h2>
          </When>
          <ForEach
            items={battleStore.battle?.users}
            render={(u) => (
              <CharacterWithHealthBar
                orientation="back"
                key={u.email}
                user={u}
                highestAggro={highestAggroPlayer.name === u.name}
                onClick={() => {
                  if (battleStore.isTargetingSkill) {
                    if (battleStore.skillId) {
                      castMutation.mutate({
                        skillId: battleStore.skillId,
                        targetName: u.name,
                      });
                    }
                    battleStore.setIsTargetingSkill(false);
                    battleStore.setIsCasting(false);
                    battleStore.setSkillId(undefined);
                  }
                }}
              />
            )}
          />
        </div>
        <BattleActions user={battleUser} api={api} isYourTurn={isYourTurn} battleEnded={battleIsFinished} />
      </When>
    </div>
  );
}
