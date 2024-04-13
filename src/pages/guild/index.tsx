import styles from "./style.module.scss";

import { useMainStore } from "@/store/main";

import { useWebsocketApi } from "@/api/websocketServer";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Query } from "@/store/query";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { When } from "@/components/When";
import ForEach from "@/components/ForEach";

import cn from "classnames";
import { useModalStore } from "@/store/modal";
import { GuildTaskInfo } from "@/components/GuildTaskInfo";
import { Button } from "@/components/Button";
import { useUserStore } from "@/store/user";
import { useState } from "react";
import { GuildApplicationInfo } from "./components/GuildApplicationInfo";
import { GuildInfo } from "./components/GuildInfo";
import { GuidMemberInfo } from "./components/GuildMemberInfo";

export function GuildPage() {
  const [showing, setShowing] = useState<"members" | "applications">("members");
  const store = useMainStore();
  const userStore = useUserStore();
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
  const guild = userStore.guild;
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
          <Button label="Members" onClick={() => setShowing("members")} />
          <Button label="Requests" onClick={() => setShowing("applications")} />
        </div>

        <When value={showing === "members"}>
          <div className={styles.membersList}>
            <span>Members: {guild?.members.length}/10</span>
            <ForEach
              items={guild?.members}
              render={(member) => (
                <GuidMemberInfo key={member.id} member={member} />
              )}
            />
          </div>
        </When>

        <When value={showing === "applications"}>
          <div className={styles.membersList}>
            <ForEach
              items={guild?.guildApplications}
              render={(application) => (
                <GuildApplicationInfo
                  key={application.id}
                  application={application}
                  permissionLevel={
                    userStore.user?.guildMember?.permissionLevel ?? 0
                  }
                />
              )}
            />
          </div>
        </When>
      </When>
    </div>
  );
}
