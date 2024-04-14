import { useModalStore } from "@/store/modal";
import styles from "./style.module.scss";
import ForEach from "@/components/ForEach";
import { useMutation } from "@tanstack/react-query";
import { useWebsocketApi } from "@/api/websocketServer";
import { Button } from "@/components/Button";
import { useUserStore } from "@/store/user";
import { When } from "@/components/When";

type Props = {
  guilds?: Guild[];
};

export function GuildRankingPage(props: Props) {
  return (
    <div className={styles.container}>
      <ForEach
        items={props.guilds}
        render={(guild) => <GuildInfoBox key={guild.id} guild={guild} />}
      />
    </div>
  );
}

function GuildInfoBox({ guild }: { guild: Guild }) {
  const userStore = useUserStore();
  const api = useWebsocketApi();
  const applyToGuildMutation = useMutation({
    mutationFn: () => api.guild.applyToGuild({ guildId: guild.id }),
  });
  const modalStore = useModalStore();
  const owner = guild.members.find((m) => m.role === "owner");
  const memberCount = guild.members.length;

  const alreadyHaveGuild = userStore.user?.guildMember?.guildId;
  return (
    <div className={styles.guildBoxContainer}>
      <img width={80} height={80} src={guild.imageUrl} />
      <div className={styles.guildInfoColumn}>
        <h2>{guild.name}</h2>
        <span>Level {guild.level}</span>
        <span>owner: {owner?.user.name}</span>
        <span>Members {memberCount}/10</span>
      </div>
      <When value={!alreadyHaveGuild}>
        <Button
          label="Apply"
          onClick={() => applyToGuildMutation.mutate()}
          disabled={applyToGuildMutation.isPending}
        />
        <Button
          label="View"
          onClick={() => modalStore.setGuildInfo({ guild, open: true })}
        />
      </When>
    </div>
  );
}
