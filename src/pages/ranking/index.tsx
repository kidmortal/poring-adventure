import { Query } from "@/store/query";
import styles from "./style.module.scss";
import { useQuery } from "@tanstack/react-query";

import { FullscreenLoading } from "@/components/FullscreenLoading";
import { useMainStore } from "@/store/main";
import { useWebsocketApi } from "@/api/websocketServer";
import { Button } from "@/components/Button";
import { useState } from "react";
import { When } from "@/components/When";
import { PlayersRankingPage } from "./players";
import { GuildRankingPage } from "./guilds";

export function RankingPage() {
  const [switchRanking, setSwitchRanking] = useState<"players" | "guild">(
    "players"
  );
  const api = useWebsocketApi();
  const store = useMainStore();
  const query = useQuery({
    queryKey: [Query.ALL_CHARACTERS],
    enabled: !!store.websocket,
    staleTime: 1000 * 10, // 10 seconds
    queryFn: () => api.users.getFirst10Users(),
  });

  const queryGuild = useQuery({
    queryKey: [Query.ALL_GUILDS],
    enabled: !!store.websocket,
    staleTime: 1000 * 60 * 5, // 5 minutes
    queryFn: () => api.guild.getAllGuilds(),
  });

  if (query.isLoading) {
    return <FullscreenLoading info="Player List" />;
  }

  console.log(queryGuild.data);

  return (
    <div className={styles.container}>
      <div className={styles.rankingSwitch}>
        <Button label="Players" onClick={() => setSwitchRanking("players")} />
        <Button label="Guild" onClick={() => setSwitchRanking("guild")} />
      </div>
      <When value={switchRanking === "players"}>
        <PlayersRankingPage users={query.data} />
      </When>
      <When value={switchRanking === "guild"}>
        <GuildRankingPage guilds={queryGuild.data} />
      </When>
    </div>
  );
}
