import styles from './style.module.scss';
import { useMutation } from '@tanstack/react-query';
import { useWebsocketApi } from '@/api/websocketServer';
import { When } from '@/components/shared/When';
import ForEach from '@/components/shared/ForEach';
import { CharacterWithHealthBar } from '@/components/Character/CharacterWithHealthBar';
import { useBattleStore } from '@/store/battle';
import { useUserStore } from '@/store/user';
import { BattleMonsterInfo } from '../BattleMonsterInfo';
import { BattleResults } from '../BattleResults';
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

  // A finished fight is a report, not an arena: it gets its own screen.
  if (battleIsFinished) {
    return <BattleResults battle={battle} api={api} />;
  }

  return (
    <>
      {/* The arena scrolls, the action bar does not. The battlefield clips what
          does not fit, so a big party or a short phone used to cut the buttons
          off the bottom of the screen — the one part of the fight that has to be
          reachable. */}
      <div className={styles.arena}>
        {/* Who is acting and who follows, so a co-op fight can be planned. */}
        <TurnOrder
          attackerList={battle.attackerList}
          attackerTurn={battle.attackerTurn}
          round={battle.round}
          users={battle.users}
          monsters={battle.monsters}
        />

        <div className={styles.logContainer}>
          <BattleLogs logs={battle.log} />
        </div>

        <div className={styles.monsterSection}>
          <ForEach
            items={battle.monsters}
            render={(m, idx) => <BattleMonsterInfo key={`${m.name}-${idx}`} monster={m} />}
          />
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
      </div>

      <BattleActions user={battleUser} api={api} isYourTurn={isYourTurn} />
    </>
  );
}
