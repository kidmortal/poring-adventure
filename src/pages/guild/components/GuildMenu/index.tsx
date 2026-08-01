import { Button } from '@/components/shared/Button';
import styles from './style.module.scss';
import { FaStoreAlt } from 'react-icons/fa';
import { VscSignOut } from 'react-icons/vsc';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ConfirmationModal } from '@/modals/ConfirmationModal';
import { useWebsocketApi } from '@/api/websocketServer';
import { useMutation } from '@tanstack/react-query';

export function GuildMenu() {
  const api = useWebsocketApi();
  const [leaveGuildModal, setLeaveGuildModal] = useState(false);
  const navigate = useNavigate();

  const leaveGuildMutation = useMutation({
    mutationFn: () => api.guild.quitFromGuild(),
    onSettled: () => setLeaveGuildModal(false),
  });

  return (
    <div className={styles.container}>
      <Button
        className={styles.action}
        label={
          <>
            <FaStoreAlt size={16} />
            <span>Guild store</span>
          </>
        }
        onClick={() => navigate('/guildstore')}
      />

      {/* The handler used to sit on the icon, so taps on the button padding did nothing. */}
      <Button
        className={styles.action}
        theme="danger"
        label={
          <>
            <VscSignOut size={16} />
            <span>Leave guild</span>
          </>
        }
        onClick={() => setLeaveGuildModal(true)}
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
  );
}
