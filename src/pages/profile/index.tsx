import { useMainStore } from "@/store/main";
import styles from "./style.module.scss";
import { CharacterInfo } from "@/components/CharacterInfo";
import { api } from "@/api/service";
import { Button } from "@/components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Query } from "@/store/query";
import { FullscreenLoading } from "@/components/FullscreenLoading";

export function ProfilePage() {
  const store = useMainStore();
  const queryClient = useQueryClient();
  const userChatacter = queryClient.getQueryState<User>([Query.USER_CHARACTER]);

  const deleteUserMutation = useMutation({
    mutationFn: () =>
      api.deleteUser(
        store.loggedUserInfo.email,
        store.loggedUserInfo.accessToken
      ),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [Query.USER_CHARACTER] }),
  });

  if (deleteUserMutation.isPending) {
    return <FullscreenLoading />;
  }
  if (userChatacter?.status === "pending") {
    return <FullscreenLoading />;
  }

  if (userChatacter?.status === "success") {
    return (
      <div className={styles.container}>
        <h2>{userChatacter?.data?.name}</h2>
        <span>
          Level {userChatacter?.data?.level} {userChatacter?.data?.classname}
        </span>
        <CharacterInfo
          costume={userChatacter?.data?.appearance?.costume ?? ""}
          gender={userChatacter?.data?.appearance?.gender ?? "female"}
          head={userChatacter?.data?.appearance?.head ?? ""}
        />
        <Button
          label="Delete my char"
          onClick={() => deleteUserMutation.mutate()}
        />
      </div>
    );
  }

  return <div className={styles.container}>No data to show</div>;
}
