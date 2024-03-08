import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { CharacterInfo } from "@/components/CharacterInfo";
import { Inventory } from "@/components/Inventory";
import { EquippedItems } from "@/components/EquipedItems";

export function ProfilePage() {
  const store = useMainStore();

  const equippedItems = store.userCharacterData?.equipment ?? [];

  return (
    <div className={styles.container}>
      <div className={styles.middleSector}>
        <EquippedItems equips={equippedItems} />
        <div className={styles.userCharacterInfoContainer}>
          <h2>{store.userCharacterData?.name}</h2>
          <span>
            Level {store.userCharacterData?.stats?.level}{" "}
            {store.userCharacterData?.classname}
          </span>
          <CharacterInfo
            costume={store.userCharacterData?.appearance?.costume ?? ""}
            gender={store.userCharacterData?.appearance?.gender ?? "female"}
            head={store.userCharacterData?.appearance?.head ?? ""}
            onClick={() => console.log(store.loggedUserInfo.accessToken)}
          />
        </div>
        <div></div>
      </div>

      <Inventory items={store.userCharacterData?.inventory} />
    </div>
  );
}
