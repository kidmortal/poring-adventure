import styles from "./style.module.scss";

import { useMainStore } from "@/store/main";

import { useWebsocketApi } from "@/api/websocketServer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Query } from "@/store/query";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { When } from "@/components/When";
import ForEach from "@/components/ForEach";
import { CharacterHead } from "@/components/CharacterInfo";
import cn from "classnames";
import { useModalStore } from "@/store/modal";
import { GuildTaskInfo } from "@/components/GuildTaskInfo";
import ExperienceBar from "@/components/ExperienceBar";
import { Button } from "@/components/Button";
import { FaStoreAlt } from "react-icons/fa";

export function GuildPage() {
  const store = useMainStore();
  const modalStore = useModalStore();
  const api = useWebsocketApi();

  const guildQuery = useQuery({
    queryKey: [Query.GUILD],
    enabled: !!store.websocket && store.wsAuthenticated,
    staleTime: Infinity,
    queryFn: () => api.guild.getGuild(),
  });

  const finishTaskMutation = useMutation({
    mutationFn: () => api.guild.finishGuildTask(),
  });

  if (guildQuery.isLoading) {
    return <FullscreenLoading info="Fetching guild info" />;
  }
  const guild = store.guild;
  const guildTask = guild?.currentGuildTask;
  const remainingKills = guildTask?.remainingKills ?? 0;
  const taskCompleted = remainingKills <= 0;

  return (
    <div className={styles.container}>
      <When value={!guild}>
        <h1>You have no guild</h1>
      </When>
      <When value={!!guild}>
        <GuildInfo guild={guild} />

        <div className={styles.internalMessageContainer}>
          {guild?.internalMessage}
        </div>
        <When value={!!guildTask}>
          <h3>Current Task</h3>
          <GuildTaskInfo
            guildTask={guildTask}
            finished={taskCompleted}
            onClick={() => {
              if (!finishTaskMutation.isPending && taskCompleted) {
                finishTaskMutation.mutate();
              }
            }}
          />
        </When>
        <When value={!guildTask}>
          <div
            onClick={() => {
              modalStore.setGuildTaskSelect({ open: true });
            }}
            className={cn(styles.guildTaskContainer, {
              [styles.selectNewTask]: true,
            })}
          >
            <h3>Click here to select a new task</h3>
          </div>
        </When>

        <div className={styles.memberViewSwitch}>
          <Button label="Members" />
          <Button label="Requests" />
        </div>
        <div className={styles.membersList}>
          <h3>Members: {guild?.members.length}/10</h3>
          <ForEach
            items={guild?.members}
            render={(member) => (
              <GuidMemberInfo key={member.id} member={member} />
            )}
          />
        </div>
      </When>
    </div>
  );
}

function GuidMemberInfo({ member }: { member: GuildMember }) {
  const appearance = member.user?.appearance;
  return (
    <div className={styles.memberInfoContainer}>
      <When value={!!appearance}>
        <CharacterHead head={appearance?.head} gender={appearance?.gender} />
      </When>
      <div className={styles.memberInfo}>
        <span>
          {member.user.name} - {member.role}
        </span>
        <span>Contribution: {member.contribution}</span>
      </div>
    </div>
  );
}

function GuildInfo({ guild }: { guild?: Guild }) {
  return (
    <div className={styles.guildInfoContainer}>
      <img width={80} height={80} src={guild?.imageUrl} />
      <div className={styles.guildLevelContainer}>
        <h3>{guild?.name}</h3>
        <span>LVL: {guild?.level}</span>
        <ExperienceBar currentExp={guild?.experience} level={guild?.level} />
      </div>
      <div className={styles.guildResourcesContainer}>
        <div className={styles.row}>
          <img src="https://kidmortal.sirv.com/misc/soulshard.webp?w=20&h=20" />
          <span>{guild?.taskPoints}</span>
        </div>
      </div>
      <div>
        <Button label={<FaStoreAlt size={24} />} />
      </div>
    </div>
  );
}
