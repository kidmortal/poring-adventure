import { BaseModal } from "../BaseModal";
import { Button } from "@/components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/api/service";
import { useMainStore } from "@/store/main";
import { Query } from "@/store/query";
import { auth } from "@/firebase";
import SignOut from "@/assets/SignOut";
import { When } from "@/components/When";
import { FullscreenLoading } from "@/components/FullscreenLoading";

type Props = {
  isOpen?: boolean;
  onRequestClose: (i?: InventoryItem) => void;
};

export function UserSettingsModal(props: Props) {
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
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <When value={deleteUserMutation.isPending}>
        <FullscreenLoading />
      </When>
      <Button
        onClick={() => auth.signOut()}
        label={
          <div
            style={{
              width: "100%",
              padding: "0 1.5rem",
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <SignOut /> Sign out
          </div>
        }
        theme="danger"
      />
      <Button
        label="Delete my char"
        onClick={() => deleteUserMutation.mutate()}
      />
    </BaseModal>
  );
}
