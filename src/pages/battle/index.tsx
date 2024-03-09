import { useWebsocketApi } from "@/api/websocketServer";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { Query } from "@/store/query";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/Button";
import { CharacterInfo } from "@/components/CharacterInfo";

export function BattlePage() {
  const store = useMainStore();
  const queryClient = useQueryClient();
  const api = useWebsocketApi();
  const query = useQuery({
    queryKey: [Query.BATTLE],
    enabled: !!store.websocket,
    staleTime: 1000 * 2,
    queryFn: () => api.createBattleInstance(),
  });

  const attackMutation = useMutation({
    mutationFn: () => api.requestBattleAttack(),
    onSuccess: (data: Battle | undefined) => {
      if (data) {
        queryClient.setQueryData([Query.BATTLE], data);
        console.log(data);
      }
    },
  });

  const cancelBattleMutation = useMutation({
    mutationFn: () => api.cancelBattleInstance(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.BATTLE] });
    },
  });

  if (query.isLoading) {
    return <FullscreenLoading />;
  }

  return (
    <div className={styles.container}>
      <div className={styles.logContainer}>
        {query.data?.log.map((log) => (
          <span key={`${log}${crypto.randomUUID()}`}>{log}</span>
        ))}
      </div>
      <div className={styles.monsterSection}>
        <div className={styles.monsterContainer}>
          <span>{query.data?.monster.name}</span>
          <span>HP {query.data?.monster.health}</span>
          <span>attack {query.data?.monster.attack}</span>
          <img src={query.data?.monster.image} />
        </div>
      </div>

      <div className={styles.userSection}>
        <div className={styles.userContainer}>
          <span>{store.userCharacterData?.name}</span>
          <span>HP: {store.userCharacterData?.stats?.health}</span>
          <CharacterInfo
            costume={`${store.userCharacterData?.classname}`}
            gender={store.userCharacterData?.appearance.gender ?? "male"}
            head={`${store.userCharacterData?.appearance.head}`}
            orientation="back"
          />
        </div>
      </div>

      <div className={styles.actions}>
        <Button
          label="Attack"
          onClick={() => attackMutation.mutate()}
          disabled={attackMutation.isPending || query.isRefetching}
        />
        <Button
          label="Reset"
          theme="danger"
          onClick={() => cancelBattleMutation.mutate()}
          disabled={cancelBattleMutation.isPending || query.isRefetching}
        />
      </div>
      <div className={styles.skills}>
        <div>
          <Button
            label={
              <div>
                <img
                  width={15}
                  height={15}
                  src="https://cdn.discordapp.com/emojis/646881350267305994.webp?size=96&quality=lossless"
                />
                <span>Fireball</span>
              </div>
            }
          />
        </div>
        <div>
          <Button
            label={
              <div>
                <img
                  width={15}
                  height={15}
                  src="https://cdn.discordapp.com/emojis/662327427049193475.webp?size=96&quality=lossless"
                />
                <span>Ice Shards</span>
              </div>
            }
          />
        </div>
      </div>
    </div>
  );
}
