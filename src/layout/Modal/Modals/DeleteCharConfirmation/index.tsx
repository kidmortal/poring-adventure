import { BaseModal } from "../BaseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Query } from "@/store/query";
import { When } from "@/components/When";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { useWebsocketApi } from "@/api/websocketServer";
import { CharacterWithHealthBar } from "@/components/CharacterWithHealthBar";

import { Button } from "@/components/Button";
import { useUserStore } from "@/store/user";

type Props = {
  isOpen?: boolean;
  onRequestClose: (i?: InventoryItem) => void;
};

export function DeleteCharConfirmationModal(props: Props) {
  const userStore = useUserStore();

  const api = useWebsocketApi();
  const queryClient = useQueryClient();

  const deleteUserMutation = useMutation({
    mutationFn: () => api.users.deleteUser(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.USER_CHARACTER] });
      props.onRequestClose();
    },
  });

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <When value={deleteUserMutation.isPending}>
        <FullscreenLoading info="User Deletion" />
      </When>
      <CharacterWithHealthBar user={userStore.user} />
      <h2>Are you sure? There is no coming back</h2>
      <Button
        label="Yes, Delete my char"
        onClick={() => {
          deleteUserMutation.mutate();
        }}
      />
    </BaseModal>
  );
}
