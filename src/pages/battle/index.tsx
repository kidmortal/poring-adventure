import { useWebsocketApi } from "@/api/websocketServer";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { Query } from "@/store/query";
import { useQuery } from "@tanstack/react-query";

export function BattlePage() {
  const store = useMainStore();
  const api = useWebsocketApi();
  const query = useQuery({
    queryKey: [Query.MONSTER],
    enabled: !!store.websocket,
    staleTime: 1000 * 2,
    queryFn: () => api.getFirstMonster(),
  });

  if (query.isLoading) {
    return <FullscreenLoading />;
  }

  return (
    <div className={styles.container}>
      <span>{query.data?.name}</span>
      <span>HP {query.data?.health}</span>
      <span>attack {query.data?.attack}</span>

      <img src={query.data?.image} />
    </div>
  );
}
