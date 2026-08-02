import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { FaMapMarkedAlt, FaRedo } from 'react-icons/fa';

import styles from './style.module.scss';
import { WebsocketApi } from '@/api/websocketServer';
import { Button } from '@/components/shared/Button';
import { TabOption, Tabs } from '@/components/shared/Tabs';
import { When } from '@/components/shared/When';
import ForEach from '@/components/shared/ForEach';
import { CharacterWithHealthBar } from '@/components/Character/CharacterWithHealthBar';
import { BattleLogs } from '../BattleLogs';
import { BattleRewardBox } from '../BattleRewardsBox';

type ResultTab = 'drops' | 'log' | 'team';

type Props = {
  battle: Battle;
  api: WebsocketApi;
};

/**
 * The screen after the last blow. The fight itself is over, so this is a report
 * rather than an arena: what was earned, what happened, who survived, and the
 * two ways out.
 */
export function BattleResults({ battle, api }: Props) {
  const [showing, setShowing] = useState<ResultTab>('drops');

  const leaveMutation = useMutation({
    mutationFn: () => api.battle.cancelBattleInstance(),
  });

  // Fighting again is the same trip: drop the finished battle, then open a new
  // one on the map it was fought on.
  const againMutation = useMutation({
    mutationFn: async (mapId: number) => {
      await api.battle.cancelBattleInstance();
      return api.battle.createBattleInstance(mapId);
    },
  });

  const won = !battle.userLost;
  const mapId = battle.monsters?.[0]?.mapId;
  const busy = leaveMutation.isPending || againMutation.isPending;

  const dropCount = battle.drops?.reduce((sum, drop) => sum + drop.dropedItems.length, 0) ?? 0;

  const tabs: TabOption<ResultTab>[] = [
    { value: 'drops', label: 'Rewards', badge: dropCount },
    { value: 'log', label: 'Log' },
    { value: 'team', label: 'Team' },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h2 className={won ? styles.victory : styles.defeat}>{won ? 'Victory' : 'Defeated'}</h2>
        <span className={styles.subtitle}>
          {won ? battle.monsters.map((monster) => monster.name).join(', ') : 'Better luck next time'}
        </span>
      </header>

      <Tabs options={tabs} selected={showing} onSelect={setShowing} />

      <div className={styles.panel}>
        <When value={showing === 'drops'}>
          <BattleRewardBox drops={battle.drops} userLost={battle.userLost} members={battle.users} />
        </When>

        <When value={showing === 'log'}>
          <div className={styles.logPanel}>
            <BattleLogs logs={battle.log} />
          </div>
        </When>

        <When value={showing === 'team'}>
          <div className={styles.team}>
            <ForEach
              items={battle.users}
              render={(user) => <CharacterWithHealthBar key={user.email} user={user} classInfo />}
            />
          </div>
        </When>
      </div>

      <div className={styles.actions}>
        <Button
          label={
            <span className={styles.actionLabel}>
              <FaRedo /> Fight again
            </span>
          }
          disabled={busy || !mapId}
          onClick={() => mapId && againMutation.mutate(mapId)}
        />
        <Button
          theme="neutral"
          label={
            <span className={styles.actionLabel}>
              <FaMapMarkedAlt /> Back to maps
            </span>
          }
          disabled={busy}
          onClick={() => leaveMutation.mutate()}
        />
      </div>
    </div>
  );
}
