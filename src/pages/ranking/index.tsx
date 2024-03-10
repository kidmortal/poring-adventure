import { Query } from "@/store/query";
import styles from "./style.module.scss";
import { useQuery } from "@tanstack/react-query";
import { CharacterInfo } from "@/components/CharacterInfo";

import { FullscreenLoading } from "@/components/FullscreenLoading";
import { Silver } from "@/components/Silver";
import { useMainStore } from "@/store/main";
import { useWebsocketApi } from "@/api/websocketServer";

export function RankingPage() {
  const api = useWebsocketApi();
  const store = useMainStore();
  const query = useQuery({
    queryKey: [Query.ALL_CHARACTERS],
    enabled: !!store.websocket,
    staleTime: 1000 * 2,
    queryFn: () => api.users.getFirst10Users(),
  });

  if (query.isLoading) {
    return <FullscreenLoading />;
  }

  return (
    <div className={styles.container}>
      {query.data?.map((u) => (
        <div className={styles.characterContainer} key={u.email}>
          <CharacterInfo
            costume={u.appearance.costume}
            gender={u.appearance.gender}
            head={u.appearance.head}
          />
          <div className={styles.characterInfo}>
            <span>
              {u.name} - LV {u.stats?.level} {u.classname}
            </span>
            <Silver amount={u.silver} />
          </div>
        </div>
      ))}
    </div>
  );
}
