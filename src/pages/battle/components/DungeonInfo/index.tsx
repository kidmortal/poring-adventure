import cn from 'classnames';
import { useMutation } from '@tanstack/react-query';
import { FaDoorOpen, FaSkull } from 'react-icons/fa';

import styles from './style.module.scss';
import { useWebsocketApi } from '@/api/websocketServer';
import { Button } from '@/components/shared/Button';
import { When } from '@/components/shared/When';
import { Silver } from '@/components/StatsComponents/Silver';
import { CharacterHead } from '@/components/Character/CharacterInfo';
import { useModalStore } from '@/store/modal';
import { useUserStore } from '@/store/user';
import { BossPath } from '../BossPath';
import { bossLevelRange, entryBlockers, totalRewards } from '../../dungeon';

type Props = {
  dungeon: Dungeon;
  entries: DungeonEntry[];
  /** The run in progress anywhere — it may belong to another dungeon. */
  run?: DungeonRun | null;
};

/**
 * One dungeon, end to end: the three bosses in the order they are fought, what
 * the run is worth, and whether the party may walk in today.
 *
 * Everything a party needs to decide with is on the card, because the decision
 * is expensive — the entry is spent on the way in, once a day, for everyone.
 */
export function DungeonInfo({ dungeon, entries, run }: Props) {
  const api = useWebsocketApi();
  const modalStore = useModalStore();
  const userStore = useUserStore();

  const enterMutation = useMutation({
    mutationFn: () => api.dungeons.enterDungeon(dungeon.id),
  });
  const continueMutation = useMutation({
    mutationFn: () => api.dungeons.continueDungeon(),
  });
  const abandonMutation = useMutation({
    mutationFn: () => api.dungeons.abandonDungeon(),
  });

  // A party fights as one, so anyone in it can hold the whole run up.
  const partyMembers = userStore.party?.members ?? [];
  const participants = (partyMembers.length > 0 ? partyMembers : [userStore.user].filter(Boolean)) as User[];
  const blockers = entryBlockers({ participants, entries, dungeonId: dungeon.id });

  const ownRun = run?.dungeonId === dungeon.id ? run : undefined;
  // A run somewhere else keeps the party out of this one just as surely as a
  // spent entry does, and the server would only say so after the attempt.
  const elsewhere = run && run.dungeonId !== dungeon.id ? run : undefined;
  const rewards = totalRewards(dungeon.monsters);
  const level = userStore.user?.stats?.level ?? 1;
  const underLevelled = level < dungeon.recommendedLevel;
  const busy = enterMutation.isPending || continueMutation.isPending || abandonMutation.isPending;

  return (
    <article className={cn(styles.card, { [styles.running]: !!ownRun })}>
      <header className={styles.cardHeader}>
        <img className={styles.portrait} src={dungeon.image} alt={dungeon.name} />
        <div className={styles.identity}>
          <h3 className={styles.name}>{dungeon.name}</h3>
          <div className={styles.badges}>
            <span className={cn(styles.badge, styles.levelBadge, { [styles.tooLow]: underLevelled })}>
              Recommended Lv {dungeon.recommendedLevel}
            </span>
            <span className={styles.badge}>{bossLevelRange(dungeon.monsters)}</span>
            <span className={cn(styles.badge, styles.bossBadge)}>
              <FaSkull /> {dungeon.monsters.length} bosses
            </span>
          </div>
        </div>
      </header>

      <p className={styles.description}>{dungeon.description}</p>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>The path</span>
        {/* Tapping a boss opens its numbers and its loot, so a party can size
            the run up before spending the day on it. */}
        <BossPath
          monsters={dungeon.monsters}
          run={ownRun}
          onSelect={(monster) =>
            modalStore.setDungeonBoss({ open: true, monster, totalStages: dungeon.monsters.length })
          }
        />
      </section>

      <section className={styles.section}>
        <span className={styles.sectionTitle}>A full clear pays</span>
        <div className={styles.rewardRow}>
          <Silver amount={rewards.silver} />
          <span className={styles.reward}>
            <span className={styles.rewardLabel}>EXP</span>
            {rewards.exp.toLocaleString()}
          </span>
          <span className={styles.rewardNote}>plus what each boss drops</span>
        </div>
      </section>

      {ownRun ? (
        <>
          <div className={styles.progress}>
            <strong>
              {ownRun.stage} of {dungeon.monsters.length}
            </strong>{' '}
            down — the party carries whatever health the last fight left them.
          </div>
          <Button
            theme="danger"
            disabled={busy}
            label={
              <span className={styles.actionLabel}>
                <FaDoorOpen /> Fight the next boss
              </span>
            }
            onClick={() => continueMutation.mutate()}
          />
          <Button
            theme="neutral"
            disabled={busy}
            label="Abandon the run"
            onClick={() => abandonMutation.mutate()}
          />
          <span className={styles.hint}>Abandoning ends the attempt — the entry does not come back.</span>
        </>
      ) : (
        <>
          <Button
            theme={blockers.length === 0 && !elsewhere ? 'danger' : 'neutral'}
            disabled={busy || blockers.length > 0 || !!elsewhere}
            label={
              <span className={styles.actionLabel}>
                <FaDoorOpen /> Enter
              </span>
            }
            onClick={() => enterMutation.mutate()}
          />

          {/* Whoever is standing in the way, and why — the server would only
              say it one at a time, and only after the attempt. */}
          <When value={blockers.length > 0}>
            <div className={styles.blockers}>
              {blockers.map((blocker) => (
                <div className={styles.blocker} key={blocker.email}>
                  <CharacterHead
                    className={styles.blockerAvatar}
                    head={blocker.appearance?.head ?? '1'}
                    gender={blocker.appearance?.gender ?? 'male'}
                  />
                  <span>
                    <strong>{blocker.name}</strong> has already run this today
                  </span>
                </div>
              ))}
            </div>
          </When>

          <When value={!!elsewhere}>
            <span className={styles.hint}>Your party is still inside {elsewhere?.dungeon?.name}.</span>
          </When>

          {/* The run spends everyone's entry, so it should not be a surprise. */}
          <When value={blockers.length === 0 && !elsewhere && partyMembers.length > 1}>
            <span className={styles.hint}>Entering spends the entry of every party member.</span>
          </When>

          <When value={blockers.length === 0 && !elsewhere && underLevelled}>
            <span className={cn(styles.hint, styles.warning)}>
              You are below the recommended level — nothing stops you, but the bosses will.
            </span>
          </When>
        </>
      )}
    </article>
  );
}
