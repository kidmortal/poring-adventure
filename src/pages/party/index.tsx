import styles from './style.module.scss';

import { PartyInfo } from './PartyInfo';
import Switch from '@/components/Switch';
import { useState } from 'react';
import { When } from '@/components/When';
import { PartyList } from './PartyList';

export function PartyPage() {
  const [showing, setShowing] = useState<'info' | 'list'>('info');
  return (
    <div className={styles.container}>
      <Switch
        leftLabel="Party Info"
        rightLabel="Open Parties"
        selected={showing === 'info' ? 'left' : 'right'}
        onSelect={(value) => {
          switch (value) {
            case 'left':
              setShowing('info');
              break;
            case 'right':
              setShowing('list');
              break;

            default:
              break;
          }
        }}
      />
      <When value={showing === 'info'}>
        <PartyInfo />
      </When>
      <When value={showing === 'list'}>
        <PartyList />
      </When>
    </div>
  );
}
