import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { CharacterInfo } from "@/components/CharacterInfo";
import { Inventory } from "@/components/Inventory";
import { CharacterStatsInfo } from "@/components/CharacterStatsInfo";

import { Equipments } from "@/components/Equipments";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@/components/IconButton";
import { PartyInfo } from "@/assets/PartyInfo";
import { useModalStore } from "@/store/modal";

import ExperienceBar from "@/components/ExperienceBar";
import { useUserStore } from "@/store/user";

export function ProfilePage() {
  const navigate = useNavigate();
  const store = useMainStore();
  const userStore = useUserStore();
  const modal = useModalStore();

  const equippedItems = userStore.user?.equipment ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.middleSector}>
        <Equipments equips={equippedItems} />
        <div className={styles.userCharacterInfoContainer}>
          <div className={styles.nameContainer}>
            <h2>{userStore.user?.name}</h2>
            <span>Level {userStore.user?.stats?.level}</span>
            <span>{userStore.user?.profession?.name}</span>
            <ExperienceBar
              currentExp={userStore.user?.stats?.experience}
              level={userStore.user?.stats?.level}
            />
          </div>

          <CharacterInfo
            costume={userStore.user?.appearance?.costume ?? ""}
            gender={userStore.user?.appearance?.gender ?? "female"}
            head={userStore.user?.appearance?.head ?? ""}
            onClick={() => {
              console.log(store.loggedUserInfo.accessToken);
              if (userStore.user?.admin) {
                navigate("/admin");
              }
            }}
          />
        </div>
        <div>
          <div className={styles.extraMenus}>
            <IconButton
              label={
                <img
                  width={20}
                  height={20}
                  src="https://kidmortal.sirv.com/misc/guild_level.webp"
                />
              }
              onClick={() => {
                navigate("/guild");
              }}
            />
            <IconButton
              label={<PartyInfo />}
              onClick={() => modal.setPartyInfo({ open: true })}
            />
            <IconButton
              label={
                <img
                  width={20}
                  height={20}
                  src="https://kidmortal.sirv.com/misc/skillbook.webp?w=20&h=20"
                />
              }
              onClick={() => modal.setSkillbook({ open: true })}
            />
          </div>
          <CharacterStatsInfo />
        </div>
      </div>

      <Inventory items={userStore.user?.inventory} />
    </div>
  );
}
