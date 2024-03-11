import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { CharacterInfo } from "@/components/CharacterInfo";
import { Inventory } from "@/components/Inventory";
import { CharacterStatsInfo } from "@/components/CharacterStatsInfo";

import { Equipments } from "@/components/Equipments";
import { useNavigate } from "react-router-dom";

export function ProfilePage() {
  const navigate = useNavigate();
  const store = useMainStore();

  const equippedItems = store.userCharacterData?.equipment ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.middleSector}>
        <Equipments equips={equippedItems} />
        <div className={styles.userCharacterInfoContainer}>
          <div className={styles.nameContainer}>
            <h2>{store.userCharacterData?.name}</h2>
            <span>
              Level {store.userCharacterData?.stats?.level}{" "}
              {store.userCharacterData?.classname}
            </span>
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
        <CharacterStatsInfo />
      </div>

      <Inventory items={store.userCharacterData?.inventory} />
    </div>
  );
}
