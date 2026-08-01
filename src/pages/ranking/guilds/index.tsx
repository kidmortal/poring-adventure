import cn from 'classnames';

import { useModalStore } from '@/store/modal';
import styles from './style.module.scss';
import ForEach from '@/components/shared/ForEach';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useWebsocketApi } from '@/api/websocketServer';
import { Query } from '@/store/query';
import { Button } from '@/components/shared/Button';
import { useUserStore } from '@/store/user';
import { When } from '@/components/shared/When';
import { FaEye, FaUserPlus } from 'react-icons/fa';

/** Guild capacity, mirrored from the server rule. */
const MAX_MEMBERS = 10;

type Props = {
  guilds?: Guild[];
};

export function GuildRankingPage(props: Props) {
  // A ranking, so the strongest guild comes first rather than the oldest.
  const guilds = [...(props.guilds ?? [])].sort(
    (a, b) => b.level - a.level || b.experience - a.experience || a.name.localeCompare(b.name),
  );

  return (
    <div className={styles.container}>
      <When value={guilds.length === 0}>
        <span className={styles.empty}>No guild has been founded yet</span>
      </When>
      <ForEach
        items={guilds}
        render={(guild) => <GuildInfoBox key={guild.id} guild={guild} rank={guilds.indexOf(guild) + 1} />}
      />
    </div>
  );
}

function GuildInfoBox({ guild, rank }: { guild: Guild; rank: number }) {
  const userStore = useUserStore();
  const api = useWebsocketApi();
  const queryClient = useQueryClient();
  const applyToGuildMutation = useMutation({
    mutationFn: () => api.guild.applyToGuild({ guildId: guild.id }),
    // The row shows whether you have applied, so it has to be re-read.
    onSettled: () => queryClient.invalidateQueries({ queryKey: [Query.ALL_GUILDS] }),
  });
  const modalStore = useModalStore();
  const owner = guild.members.find((m) => m.role === 'owner');
  const memberCount = guild.members.length;

  const myGuildId = userStore.user?.guildMember?.guildId;
  const isMyGuild = myGuildId === guild.id;
  const isFull = memberCount >= MAX_MEMBERS;
  const alreadyApplied = guild.guildApplications?.some((a) => a.userEmail === userStore.user?.email);

  let applyBlockedReason: string | undefined;
  if (myGuildId) applyBlockedReason = isMyGuild ? 'Your guild' : 'In a guild';
  else if (isFull) applyBlockedReason = 'Full';
  else if (alreadyApplied) applyBlockedReason = 'Applied';

  return (
    <div className={cn(styles.row, { [styles.mine]: isMyGuild })}>
      <span className={cn(styles.rank, styles[`rank${rank}`])}>{rank}</span>

      <img className={styles.emblem} width={44} height={44} src={guild.imageUrl} alt={guild.name} />

      <div className={styles.info}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{guild.name}</span>
          <span className={styles.level}>Lv {guild.level}</span>
        </div>
        <span className={styles.meta}>{owner?.user?.name ? `Led by ${owner.user.name}` : 'No owner'}</span>
        <div className={styles.stats}>
          <span className={cn(styles.members, { [styles.membersFull]: isFull })}>
            {memberCount}/{MAX_MEMBERS} members
          </span>
          <span className={styles.experience}>{(guild.experience ?? 0).toLocaleString()} exp</span>
        </div>
      </div>

      {/* Viewing is always available; applying is what the state can block. */}
      <div className={styles.actions}>
        <Button
          className={styles.actionButton}
          label={
            <span className={styles.buttonLabel}>
              <FaEye /> View
            </span>
          }
          theme="neutral"
          onClick={() => modalStore.setGuildInfo({ guild, open: true })}
        />
        <Button
          className={styles.actionButton}
          label={
            <span className={styles.buttonLabel}>
              <FaUserPlus /> {applyBlockedReason ?? 'Apply'}
            </span>
          }
          theme={applyBlockedReason ? 'neutral' : 'primary'}
          disabled={!!applyBlockedReason || applyToGuildMutation.isPending}
          onClick={() => applyToGuildMutation.mutate()}
        />
      </div>
    </div>
  );
}
