import styles from "./style.module.scss";

import { useMainStore } from "@/store/main";

import { useWebsocketApi } from "@/api/websocketServer";
import { useQuery } from "@tanstack/react-query";
import { Query } from "@/store/query";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { When } from "@/components/When";
import ForEach from "@/components/ForEach";
import { CharacterHead } from "@/components/CharacterInfo";
import cn from "classnames";
import { useModalStore } from "@/store/modal";

export function GuildPage() {
  const store = useMainStore();
  const api = useWebsocketApi();

  const guildQuery = useQuery({
    queryKey: [Query.GUILD],
    enabled: !!store.websocket && store.wsAuthenticated,
    staleTime: Infinity,
    queryFn: () => api.guild.getGuild(),
  });

  if (guildQuery.isLoading) {
    return <FullscreenLoading info="Fetching guild info" />;
  }
  const guild = store.guild;

  return (
    <div className={styles.container}>
      <When value={!guild}>
        <h1>You have no guild</h1>
      </When>
      <When value={!!guild}>
        <div className={styles.topContainer}>
          <img width={80} height={80} src={guild?.imageUrl} />
          <div className={styles.guildLevelContainer}>
            <h1>{guild?.name}</h1>

            <span>Level: {guild?.level}</span>
            <span>Experience: {guild?.experience}</span>
          </div>
        </div>

        <div className={styles.internalMessageContainer}>
          {guild?.internalMessage}
        </div>

        <TaskInfo guildTask={guild?.currentGuildTask} />

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

function TaskInfo(props: { guildTask?: CurrentGuildTask }) {
  const modalStore = useModalStore();
  const hasTask = !!props.guildTask;
  const taskTotalKils = props.guildTask?.task.killCount ?? 0;
  const remainingKills = props.guildTask?.remainingKills ?? 0;
  const killedMonsters = (remainingKills - taskTotalKils) * -1;
  const taskCompleted = remainingKills <= 0;
  return (
    <>
      <When value={hasTask}>
        <div
          className={cn(styles.guildTaskContainer, {
            [styles.completed]: taskCompleted,
          })}
        >
          <h3>Current Task</h3>
          <div className={styles.guildTaskDetails}>
            <div>
              {props.guildTask?.task?.name}
              <div>Map: {props.guildTask?.task.target.name}</div>
            </div>
            <div className={styles.taskMapContainer}>
              <img src={props.guildTask?.task.target.image} />
              <span>
                {killedMonsters}/{taskTotalKils}
              </span>
            </div>
          </div>
        </div>
      </When>
      <When value={!hasTask}>
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
    </>
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
        <span>{member.user.name}</span>
        <span>Contribution: {member.contribution}</span>
      </div>
    </div>
  );
}
