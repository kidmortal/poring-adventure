import { BaseModal } from "../BaseModal";
import { Button } from "@/components/Button";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Query } from "@/store/query";
import { auth } from "@/firebase";
import SignOut from "@/assets/SignOut";
import { When } from "@/components/When";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { useWebsocketApi } from "@/api/websocketServer";
import { useModalStore } from "@/store/modal";

type Props = {
  isOpen?: boolean;
  onRequestClose: (i?: InventoryItem) => void;
};

export function UserSettingsModal(props: Props) {
  const modalStore = useModalStore();
  const api = useWebsocketApi();
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: () => api.users.deleteUser(),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [Query.USER_CHARACTER] }),
  });

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <When value={deleteUserMutation.isPending}>
        <FullscreenLoading info="Deleting character" />
      </When>
      <Button
        label="Edit Character"
        onClick={() => {
          modalStore.setUserConfig({ open: false });
          modalStore.setEditCharacter({ open: true });
        }}
      />
      <Button
        label="Mail box"
        onClick={() => {
          modalStore.setUserConfig({ open: false });
          modalStore.setMailBox({ open: true });
        }}
      />
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
        onClick={() => {
          modalStore.setUserConfig({ open: false });
          modalStore.setConfirmDeleteCharacter({ open: true });
        }}
      />
    </BaseModal>
  );
}
