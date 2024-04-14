import { Button } from "@/components/Button";
import styles from "./style.module.scss";
import { FaStoreAlt } from "react-icons/fa";
import { VscSignOut } from "react-icons/vsc";
import { useModalStore } from "@/store/modal";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { ConfirmationModal } from "@/modals/ConfirmationModal";
import { useWebsocketApi } from "@/api/websocketServer";
import { useMutation } from "@tanstack/react-query";

export function GuildMenu() {
  const api = useWebsocketApi();
  const [leaveGuildModal, setLeaveGuildModal] = useState(false);
  const navigate = useNavigate();
  const modalStore = useModalStore();

  const leaveGuildMutation = useMutation({
    mutationFn: () => api.guild.quitFromGuild(),
    onSettled: () => setLeaveGuildModal(false),
  });

  return (
    <div className={styles.container}>
      <div className={styles.buttonsContainer}>
        <Button
          label={<FaStoreAlt size={24} />}
          onClick={() => navigate("/guildstore")}
        />
        <Button
          onClick={() => modalStore.setGuildBlessing({ open: true })}
          label={
            <img src="https://kidmortal.sirv.com/misc/blessing.png?w=24&h=24" />
          }
        />
      </div>
      <div className={styles.row}>
        <Button
          theme="danger"
          label={
            <VscSignOut size={24} onClick={() => setLeaveGuildModal(true)} />
          }
        />
        <ConfirmationModal
          isOpen={leaveGuildModal}
          message="Are you sure to leave the guild?"
          onConfirm={() => leaveGuildMutation.mutate()}
          onCancel={() => setLeaveGuildModal(false)}
          isPending={leaveGuildMutation.isPending}
          onRequestClose={() => setLeaveGuildModal(false)}
        />
      </div>
    </div>
  );
}
