import { useWebsocketApi } from "@/api/websocketServer";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { useMainStore } from "@/store/main";
import { useMutation, useQuery } from "@tanstack/react-query";
import styles from "./style.module.scss";
import { Button } from "@/components/Button";

export default function AdminSocketManager() {
  const store = useMainStore();
  const api = useWebsocketApi();
  const query = useQuery({
    queryKey: ["sockets"],
    enabled: !!store.websocket,
    staleTime: 1000 * 2,
    queryFn: () => api.admin.getAllWebsockets(),
  });

  const notificationMutation = useMutation({
    mutationFn: (args: { to: string; message: string }) =>
      api.admin.sendWebsocketNotification(args),
  });

  if (query.isLoading) {
    return <FullscreenLoading info="Admin socket" />;
  }

  return (
    <div className={styles.container}>
      {query.data?.map((socket) => (
        <div className={styles.row}>
          <div>
            <span>id: {socket.id}</span>
            <span>email: {socket.email}</span>
          </div>
          <Button
            label="MSG"
            onClick={() =>
              notificationMutation.mutate({
                to: socket.email,
                message: "You have been hacked",
              })
            }
            disabled={notificationMutation.isPending}
          />
        </div>
      ))}
    </div>
  );
}
