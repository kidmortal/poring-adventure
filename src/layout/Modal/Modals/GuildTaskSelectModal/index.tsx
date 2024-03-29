import styles from "./style.module.scss";
import { BaseModal } from "../BaseModal";
import { useQuery } from "@tanstack/react-query";
import { Query } from "@/store/query";
import { useMainStore } from "@/store/main";
import { useWebsocketApi } from "@/api/websocketServer";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import ForEach from "@/components/ForEach";

type Props = {
  isOpen?: boolean;
  onRequestClose: () => void;
};

export function GuildTaskSelectModal({ isOpen, onRequestClose }: Props) {
  const api = useWebsocketApi();
  const store = useMainStore();

  const query = useQuery({
    queryKey: [Query.ALL_GUILD_TASK],
    enabled: !!store.websocket,
    staleTime: Infinity,
    queryFn: () => api.guild.getGuildAvailableTasks(),
  });

  if (query?.status === "pending") {
    return <FullscreenLoading info="Guild tasks" />;
  }

  return (
    <BaseModal onRequestClose={onRequestClose} isOpen={isOpen}>
      <div className={styles.container}>
        <ForEach
          items={query.data}
          render={(task) => <AvailableTask key={task.id} task={task} />}
        />
      </div>
    </BaseModal>
  );
}

function AvailableTask({ task }: { task: GuildTask }) {
  return (
    <div>
      <span>{task.name}</span>
    </div>
  );
}
