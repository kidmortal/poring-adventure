import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { CharacterInfo } from "@/components/CharacterInfo";
import { api } from "@/api/service";
import { Button } from "@/components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Query } from "@/store/query";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { Inventory } from "@/components/Inventory";
import { When } from "@/components/When";
import { EquippedItems } from "@/components/EquipedItems";

export function ProfilePage() {
  const store = useMainStore();
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: () =>
      api.deleteUser(
        store.loggedUserInfo.email,
        store.loggedUserInfo.accessToken
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [Query.USER_CHARACTER] }),
  });

  const equippedItems = store.userCharacterData?.equipment ?? [];

  return (
    <div className={styles.container}>
      <When value={deleteUserMutation.isPending}>
        <FullscreenLoading />
      </When>
      <div className={styles.middleSector}>
        <EquippedItems equips={equippedItems} />
        <div className={styles.userCharacterInfoContainer}>
          <h2>{store.userCharacterData?.name}</h2>
          <span>
            Level {store.userCharacterData?.level}{" "}
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
      <Button
        label="Delete my char"
        onClick={() => deleteUserMutation.mutate()}
        theme="danger"
      />
    </div>
  );
}
