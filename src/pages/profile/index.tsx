import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { CharacterInfo } from "@/components/CharacterInfo";
import { Inventory } from "@/components/Inventory";
import { CharacterStatsInfo } from "@/components/CharacterStatsInfo";

import { Equipments } from "@/components/Equipments";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@/components/IconButton";
import { FriendList } from "@/assets/FriendList";
import { PartyInfo } from "@/assets/PartyInfo";
import { useModalStore } from "@/store/modal";
import { Skillbook } from "@/assets/Skillboook";
import ExperienceBar from "@/components/ExperienceBar";

export function ProfilePage() {
  const navigate = useNavigate();
  const store = useMainStore();
  const modal = useModalStore();

  const equippedItems = store.userCharacterData?.equipment ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.middleSector}>
        <Equipments equips={equippedItems} />
        <div className={styles.userCharacterInfoContainer}>
          <div className={styles.nameContainer}>
            <h2>{store.userCharacterData?.name}</h2>
            <span>Level {store.userCharacterData?.stats?.level}</span>
            <span>{store.userCharacterData?.profession?.name}</span>
            <ExperienceBar
              currentExp={store.userCharacterData?.stats?.experience}
              level={store.userCharacterData?.stats?.level}
            />
          </div>

          <CharacterInfo
            costume={store.userCharacterData?.appearance?.costume ?? ""}
            gender={store.userCharacterData?.appearance?.gender ?? "female"}
            head={store.userCharacterData?.appearance?.head ?? ""}
            onClick={() => {
              console.log(store.loggedUserInfo.accessToken);
              if (store.userCharacterData?.admin) {
                navigate("/admin");
              }
            }}
          />
        </div>
        <div>
          <div className={styles.extraMenus}>
            <IconButton
              label={<FriendList />}
              onClick={() => modal.setFriendlist({ open: true })}
            />
            <IconButton
              label={<PartyInfo />}
              onClick={() => modal.setPartyInfo({ open: true })}
            />
            <IconButton
              label={<Skillbook />}
              onClick={() => modal.setSkillbook({ open: true })}
            />
          </div>
          <CharacterStatsInfo />
        </div>
      </div>

      <Inventory items={store.userCharacterData?.inventory} />
    </div>
  );
}
