import { CharacterHead } from '@/components/Character/CharacterInfo';
import styles from './style.module.scss';

import { When } from '@/components/shared/When';

export function GuidMemberInfo({ member }: { member: GuildMember }) {
  const appearance = member.user?.appearance;
  return (
    <div className={styles.memberInfoContainer}>
      <When value={!!appearance}>
        <CharacterHead head={appearance?.head} gender={appearance?.gender} />
      </When>
      <div className={styles.memberInfo}>
        <span>
          {member.user.name} - {member.role}
        </span>
        <span>Contribution: {member.contribution}</span>
      </div>
    </div>
  );
}
