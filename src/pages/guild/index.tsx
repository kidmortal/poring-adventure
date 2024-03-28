import styles from "./style.module.scss";

import { useMainStore } from "@/store/main";

import { useWebsocketApi } from "@/api/websocketServer";
import { useQuery } from "@tanstack/react-query";
import { Query } from "@/store/query";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { When } from "@/components/When";
import ForEach from "@/components/ForEach";
import { CharacterHead } from "@/components/CharacterInfo";

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
        <div className={styles.guildLevelContainer}>
          <h1>{guild?.name}</h1>
          <img src={guild?.imageUrl} />
          <span>Level: {guild?.level}</span>
          <span>Experience: {guild?.experience}</span>
        </div>
        <div className={styles.internalMessageContainer}>
          {guild?.internalMessage}
        </div>

        <div className={styles.membersList}>
          <h3>Members: {guild?.members.length}/10</h3>
          <ForEach
            items={guild?.members}
            render={(member) => (
              <GuidMemberInfo key={member.id} member={member} />
            )}
          />
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
        <span>{member.user.name}</span>
        <span>Contribution: {member.contribution}</span>
      </div>
    </div>
  );
}
