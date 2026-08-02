import styles from './style.module.scss';
import { useMutation } from '@tanstack/react-query';
import { useWebsocketApi } from '@/api/websocketServer';
import { When } from '@/components/shared/When';
import ForEach from '@/components/shared/ForEach';
import { CharacterWithHealthBar } from '@/components/Character/CharacterWithHealthBar';
import { useBattleStore } from '@/store/battle';
import { useUserStore } from '@/store/user';
import { BattleMonsterInfo } from '../BattleMonsterInfo';
import { BattleRewardBox } from '../BattleRewardsBox';
import { BattleLogs } from '../BattleLogs';
import { BattleActions } from '../BattleActions';
import { TurnOrder } from '../TurnOrder';

/** The player the monsters are currently focused on. */
function highestAggroUser(users: BattleUser[]) {
  return users.reduce((highest, user) => ((user.aggro ?? 0) > (highest?.aggro ?? 0) ? user : highest), users[0]);
}

export function ActiveBattle({ battle }: { battle: Battle }) {
  const api = useWebsocketApi();
  const userStore = useUserStore();
  const battleStore = useBattleStore();

  const castMutation = useMutation({
    mutationFn: (params: { skillId: number; targetName?: string }) => api.battle.requestBattleCast(params),
  });

  const battleIsFinished = battle.battleFinished;
  const turnName = battle.attackerList[battle.attackerTurn ?? 0];
  const isYourTurn = userStore.user?.name === turnName;
  const battleUser = battle.users.find((u) => u.email === userStore.user?.email);
  const focusedPlayer = highestAggroUser(battle.users);

  /** Skills that target an ally wait for the player to pick one. */
  function castOnAlly(targetName: string) {
    if (!battleStore.isTargetingSkill || !battleStore.skillId) return;

    castMutation.mutate({ skillId: battleStore.skillId, targetName });
    battleStore.setIsTargetingSkill(false);
    battleStore.setIsCasting(false);
    battleStore.setSkillId(undefined);
  }

  return (
    <>
      {/* Who is acting and who follows, so a co-op fight can be planned. */}
      <TurnOrder
        attackerList={battle.attackerList}
        attackerTurn={battle.attackerTurn}
        users={battle.users}
        monsters={battle.monsters}
      />

      <div className={styles.logContainer}>
        <BattleLogs logs={battle.log} />
      </div>

      <div className={styles.monsterSection}>
        <When value={!battleIsFinished}>
          <ForEach
            items={battle.monsters}
            render={(m, idx) => <BattleMonsterInfo key={`${m.name}-${idx}`} monster={m} />}
          />
        </When>
        <When value={battleIsFinished}>
          <BattleRewardBox drops={battle.drops} userLost={battle.userLost} members={battle.users} />
        </When>
      </div>

      <div className={styles.userSection}>
        <When value={battleStore.isTargetingSkill}>
          <h2 className={styles.targetingSkillLabel}>Click on Ally or press again to auto-choose</h2>
        </When>
        <ForEach
          items={battle.users}
          render={(u) => (
            <CharacterWithHealthBar
              orientation="back"
              key={u.email}
              user={u}
              highestAggro={focusedPlayer?.name === u.name}
              onClick={() => castOnAlly(u.name)}
            />
          )}
        />
      </div>

      <BattleActions user={battleUser} api={api} isYourTurn={isYourTurn} battleEnded={battleIsFinished} />
    </>
  );
}
