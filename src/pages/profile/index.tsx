import styles from './style.module.scss';

import Switch from '@/components/shared/Switch';
import { useState } from 'react';
import { When } from '@/components/shared/When';
import { UserProfile } from './UserProfile';
import { UserProfession } from './UserProfession';

export function ProfilePage() {
  const [showing, setShowing] = useState<'profile' | 'profession'>('profile');

  return (
    <div className={styles.container}>
      <Switch
        leftLabel="Profile"
        rightLabel="Profession"
        selected={showing === 'profile' ? 'left' : 'right'}
        onSelect={(value) => {
          switch (value) {
            case 'left':
              setShowing('profile');
              break;
            case 'right':
              setShowing('profession');
              break;

            default:
              break;
          }
        }}
      />
      <div className={styles.midContainer}>
        <When value={showing === 'profile'}>
          <UserProfile />
        </When>
        <When value={showing === 'profession'}>
          <UserProfession />
        </When>
      </div>
    </div>
  );
}
