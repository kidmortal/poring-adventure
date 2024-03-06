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

  return (
    <div className={styles.container}>
      <When value={deleteUserMutation.isPending}>
        <FullscreenLoading />
      </When>
      <h2>{store.userCharacterData?.name}</h2>
      <span>
        Level {store.userCharacterData?.level}{" "}
        {store.userCharacterData?.classname}
      </span>
      <div className={styles.silverContainer}>
        <span>{store.userCharacterData?.silver}</span>
        <img src="https://cdn.discordapp.com/emojis/651562374326779955.webp?size=96&quality=lossless" />
      </div>
      <CharacterInfo
        costume={store.userCharacterData?.appearance?.costume ?? ""}
        gender={store.userCharacterData?.appearance?.gender ?? "female"}
        head={store.userCharacterData?.appearance?.head ?? ""}
        onClick={() => console.log(store.loggedUserInfo.accessToken)}
      />
      <Inventory items={store.userCharacterData?.items} />
      <Button
        label="Delete my char"
        onClick={() => deleteUserMutation.mutate()}
      />
    </div>
  );
}
