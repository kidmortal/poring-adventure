import { useMainStore } from '@/store/main';
import styles from './style.module.scss';
import { CharacterInfo } from '@/components/Character/CharacterInfo';
import { Inventory } from '@/components/Items/Inventory';
import { CharacterStatsInfo } from '@/components/Character/CharacterStatsInfo';

import { Equipments } from '@/components/Items/Equipments';
import { useNavigate } from 'react-router-dom';
import { IconButton } from '@/components/shared/IconButton';
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
            <IconButton
              label={<img width={20} height={20} src="https://kidmortal.sirv.com/misc/guild_level.webp" />}
              onClick={() => {
                navigate('/guild');
              }}
            />
            <IconButton label={<PartyInfo />} onClick={() => navigate('/party')} />
            <IconButton
              label={<img width={20} height={20} src="https://kidmortal.sirv.com/misc/skillbook.webp?w=20&h=20" />}
              onClick={() => modal.setSkillbook({ open: true })}
            />
          </div>
        </div>

        <ExperienceBar currentExp={userStore.user?.stats?.experience} level={userStore.user?.stats?.level} />
      </section>

      <CharacterStatsInfo />

      <Inventory items={userStore.user?.inventory} />
    </div>
  );
}
