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

export function UserProfile() {
  const navigate = useNavigate();
  const store = useMainStore();
  const userStore = useUserStore();
  const modal = useModalStore();

  const equippedItems = userStore.user?.inventory.filter((item) => item.equipped) ?? [];

  return (
    <div className={styles.container}>
      {/* Equips | character | shortcuts, then a full-width exp bar underneath. */}
      <section className={styles.heroCard}>
        <div className={styles.heroRow}>
          <Equipments equips={equippedItems} />

          <div className={styles.userCharacterInfoContainer}>
            <div className={styles.nameContainer}>
              <h2>{userStore.user?.name}</h2>
              <span className={styles.subtitle}>
                Lv {userStore.user?.stats?.level} · {userStore.user?.profession?.name}
              </span>
            </div>

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

          <div className={styles.extraMenus}>
            <button className={styles.shortcut} onClick={() => navigate('/guild')}>
              <img width={28} height={28} src="https://kidmortal.sirv.com/misc/guild_level.webp" />
              <span>Guild</span>
            </button>
            <button className={styles.shortcut} onClick={() => navigate('/party')}>
              <PartyInfo size={28} />
              <span>Party</span>
            </button>
            <button className={styles.shortcut} onClick={() => modal.setSkillbook({ open: true })}>
              <img width={28} height={28} src="https://kidmortal.sirv.com/misc/skillbook.webp?w=28&h=28" />
              <span>Spells</span>
            </button>
          </div>
        </div>

        <ExperienceBar currentExp={userStore.user?.stats?.experience} level={userStore.user?.stats?.level} />
      </section>

      <CharacterStatsInfo />

      <Inventory items={userStore.user?.inventory} />
    </div>
  );
}
