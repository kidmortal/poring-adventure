import styles from './style.module.scss';

import { useWebsocketApi } from '@/api/websocketServer';
import { useMutation } from '@tanstack/react-query';

import ForEach from '@/components/shared/ForEach';

import { useModalStore } from '@/store/modal';
import { GuildTaskInfo } from '@/components/GuildTaskInfo';
import { useUserStore } from '@/store/user';
import { useState } from 'react';
import { GuildApplicationInfo } from './components/GuildApplicationInfo';
import { GuildInfo } from './components/GuildInfo';
import { GuidMemberInfo } from './components/GuildMemberInfo';
import { GuildMenu } from './components/GuildMenu';
import { GuildBlessings } from './components/GuildBlessings';
import { Tabs, TabOption } from '@/components/shared/Tabs';
import { Button } from '@/components/shared/Button';

type GuildTab = 'overview' | 'members' | 'requests';

export function GuildPage() {
  const [showing, setShowing] = useState<GuildTab>('overview');
  const userStore = useUserStore();
  const modalStore = useModalStore();
  const api = useWebsocketApi();

  const finishTaskMutation = useMutation({
    mutationFn: () => api.guild.finishQuest(),
  });

  const guild = userStore.guild;

  if (!guild) {
    return <h1 className={styles.noGuild}>You have no guild</h1>;
  }

  const guildTask = guild.currentGuildTask;
  const taskCompleted = (guildTask?.remainingKills ?? 0) <= 0;
  const applications = guild.guildApplications ?? [];
  const members = [...(guild.members ?? [])].sort((a, b) => b.contribution - a.contribution);

  const tabs: TabOption<GuildTab>[] = [
    { value: 'overview', label: 'Overview' },
    { value: 'members', label: 'Members' },
    { value: 'requests', label: 'Requests', badge: applications.length },
  ];

  return (
    <div className={styles.container}>
      <GuildInfo guild={guild} />

      <Tabs options={tabs} selected={showing} onSelect={setShowing} />

      <div className={styles.tabPanel}>
        {showing === 'overview' && (
          <>
            <section className={styles.section}>
              <span className={styles.sectionTitle}>Guild task</span>
              {guildTask ? (
                <GuildTaskInfo
                  guildTask={guildTask}
                  finished={taskCompleted}
                  onClick={() => {
                    if (!finishTaskMutation.isPending && taskCompleted) {
                      finishTaskMutation.mutate();
                    }
                  }}
                />
              ) : (
                <div className={styles.emptyTask}>
                  <span>No task in progress</span>
                  <Button label="Select a task" onClick={() => modalStore.setGuildTaskSelect({ open: true })} />
                </div>
              )}
            </section>

            <GuildBlessings blessing={guild.blessing} />

            <GuildMessage title="Announcement" message={guild.publicMessage} />
            <GuildMessage title="Members only" message={guild.internalMessage} />

            <GuildMenu />
          </>
        )}

        {showing === 'members' && (
          <section className={styles.section}>
            <div className={styles.listHeader}>
              <span className={styles.sectionTitle}>Members</span>
              <span className={styles.count}>
                {members.length}/{MAX_GUILD_MEMBERS}
              </span>
            </div>
            <div className={styles.list}>
              <ForEach
                items={members}
                render={(member) => (
                  <GuidMemberInfo
                    key={member.id}
                    member={member}
                    isLeader={member.userEmail === guild.leaderEmail}
                    onClick={() => modalStore.setGuildMember({ open: true, member })}
                  />
                )}
              />
            </div>
          </section>
        )}

        {showing === 'requests' && (
          <section className={styles.section}>
            <span className={styles.sectionTitle}>Join requests</span>
            {applications.length === 0 ? (
              <span className={styles.empty}>Nobody has applied yet.</span>
            ) : (
              <div className={styles.list}>
                <ForEach
                  items={applications}
                  render={(application) => (
                    <GuildApplicationInfo
                      key={application.id}
                      application={application}
                      permissionLevel={userStore.user?.guildMember?.permissionLevel ?? 0}
                    />
                  )}
                />
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
}

/** Guild capacity is fixed server-side. */
const MAX_GUILD_MEMBERS = 10;

function GuildMessage({ title, message }: { title: string; message?: string }) {
  if (!message) return <></>;

  return (
    <section className={styles.section}>
      <span className={styles.sectionTitle}>{title}</span>
      <p className={styles.message}>{message}</p>
    </section>
  );
}
