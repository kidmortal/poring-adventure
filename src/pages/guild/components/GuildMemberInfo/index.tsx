import { CharacterHead } from '@/components/Character/CharacterInfo';
import styles from './style.module.scss';
import cn from 'classnames';

import { When } from '@/components/shared/When';

export function GuidMemberInfo({ member, isLeader }: { member: GuildMember; isLeader?: boolean }) {
  const appearance = member.user?.appearance;

  return (
    <div className={cn(styles.memberInfoContainer, { [styles.leader]: isLeader })}>
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
