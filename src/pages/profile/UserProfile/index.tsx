import { useMainStore } from '@/store/main';
import styles from './style.module.scss';
import { CharacterInfo } from '@/components/Character/CharacterInfo';
import { Inventory } from '@/components/Items/Inventory';
import { CharacterStatsInfo } from '@/components/Character/CharacterStatsInfo';

import { Equipments } from '@/components/Items/Equipments';
import { useNavigate } from 'react-router-dom';
import { PartyInfo } from '@/assets/PartyInfo';
import { useModalStore } from '@/store/modal';

import ExperienceBar from '@/components/StatsComponents/ExperienceBar';
import { useUserStore } from '@/store/user';

// The paper doll: three pieces down the left of the character, two down the
// right. Splitting them 3/2 is what makes the gear as tall as the sprite, so the
// card has no corner left over for something to be stranded in.
const LEFT_SLOTS = ['weapon', 'armor', 'legs'] as const;
const RIGHT_SLOTS = ['boots', 'accessory'] as const;

export function UserProfile() {
  const navigate = useNavigate();
  const store = useMainStore();
  const userStore = useUserStore();
  const modal = useModalStore();

  const equippedItems = userStore.user?.inventory.filter((item) => item.equipped) ?? [];

  return (
    <div className={styles.container}>
      {/* Identity, then the paper doll, then the bar, then the shortcuts: four
          full-width bands rather than four columns fighting over one row. The
          old shape left the gear floating in one corner, the accessory stranded
          in another and a hole in the middle of a tall card. */}
      <section className={styles.heroCard}>
        <div className={styles.identityRow}>
          <h2 className={styles.name}>{userStore.user?.name}</h2>
          <span className={styles.identityMeta}>
            {userStore.user?.class?.name} · Lv {userStore.user?.stats?.level}
          </span>
        </div>

        <div className={styles.heroRow}>
          <Equipments equips={equippedItems} slots={LEFT_SLOTS} />

          <div className={styles.userCharacterInfoContainer}>
            <CharacterInfo
              costume={userStore.user?.appearance?.costume ?? ''}
              gender={userStore.user?.appearance?.gender ?? 'female'}
              head={userStore.user?.appearance?.head ?? ''}
              onClick={() => {
                console.log(store.loggedUserInfo.accessToken);
                if (userStore.user?.admin) {
                  navigate('/admin');
                }
              }}
            />
          </div>

          <Equipments equips={equippedItems} slots={RIGHT_SLOTS} />
        </div>

        <ExperienceBar currentExp={userStore.user?.stats?.experience} level={userStore.user?.stats?.level} />

        {/* Across the bottom rather than stacked in the corner: these are three
            places to go, not a third rail of gear, and a full-width row gives
            them a thumb-sized target each. */}
        <div className={styles.extraMenus}>
          <button className={styles.shortcut} onClick={() => navigate('/guild')}>
            <img width={26} height={26} src="https://kidmortal.sirv.com/misc/guild_level.webp" />
            <span>Guild</span>
          </button>
          <button className={styles.shortcut} onClick={() => navigate('/party')}>
            <PartyInfo size={26} />
            <span>Party</span>
          </button>
          <button className={styles.shortcut} onClick={() => modal.setSkillbook({ open: true })}>
            <img width={26} height={26} src="https://kidmortal.sirv.com/misc/skillbook.webp?w=28&h=28" />
            <span>Spells</span>
          </button>
        </div>
      </section>

      <CharacterStatsInfo />

      <Inventory items={userStore.user?.inventory} />
    </div>
  );
}
