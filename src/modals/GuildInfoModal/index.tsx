import styles from './style.module.scss';
import { BaseModal } from '../BaseModal';
import ForEach from '@/components/shared/ForEach';

type Props = {
  isOpen?: boolean;
  guild?: Guild;
  onRequestClose: () => void;
};

export function GuildInfoModal({ guild, isOpen, onRequestClose }: Props) {
  return (
    <BaseModal onRequestClose={onRequestClose} isOpen={isOpen}>
      <div className={styles.container}>
        <span>{guild?.name}</span>
        <ForEach items={guild?.members} render={(member) => <span>{member.user.name}</span>} />
      </div>
    </BaseModal>
  );
}
