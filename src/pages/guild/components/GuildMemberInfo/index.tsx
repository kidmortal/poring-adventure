import { CharacterHead } from '@/components/Character/CharacterInfo';
import styles from './style.module.scss';
import cn from 'classnames';

import { When } from '@/components/shared/When';

type Props = {
  member: GuildMember;
  isLeader?: boolean;
  onClick?: () => void;
};

export function GuidMemberInfo({ member, isLeader, onClick }: Props) {
  const appearance = member.user?.appearance;

  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      className={cn(styles.memberInfoContainer, { [styles.leader]: isLeader, [styles.clickable]: !!onClick })}
    >
      <When value={!!appearance}>
        <CharacterHead className={styles.avatar} head={appearance?.head} gender={appearance?.gender} />
      </When>

      <div className={styles.memberInfo}>
        <div className={styles.nameRow}>
          <span className={styles.name}>{member.user.name}</span>
          <span className={cn(styles.roleBadge, { [styles.leaderBadge]: isLeader })}>{member.role}</span>
        </div>
        <span className={styles.level}>Lv {member.user.stats?.level ?? 0}</span>
      </div>

      <div className={styles.stats}>
        <span className={styles.contribution} title="Contribution">
          {member.contribution}
        </span>
        <span className={styles.statLabel}>contrib.</span>
      </div>
    </div>
  );
}
