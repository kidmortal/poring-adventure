import { BaseModal } from "../BaseModal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Query } from "@/store/query";
import { When } from "@/components/When";
import { FullscreenLoading } from "@/components/FullscreenLoading";
import { useWebsocketApi } from "@/api/websocketServer";
import { CharacterWithHealthBar } from "@/components/CharacterWithHealthBar";
import { useMainStore } from "@/store/main";
import { useState } from "react";
import Input from "@/components/Input";
import { Button } from "@/components/Button";

type Props = {
  isOpen?: boolean;
  onRequestClose: (i?: InventoryItem) => void;
};

export function UserEditCharacterModal(props: Props) {
  const [newName, setNewName] = useState("");
  const store = useMainStore();
  const api = useWebsocketApi();
  const queryClient = useQueryClient();

  const changeNameMutation = useMutation({
    mutationFn: () => api.users.updateUserName(newName),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: [Query.USER_CHARACTER] }),
  });

  const validName = newName.length > 3;

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <When value={changeNameMutation.isPending}>
        <FullscreenLoading info="User Deletion" />
      </When>
      <CharacterWithHealthBar user={store.userCharacterData} />
      <Input
        placeholder="New name"
        value={newName}
        onChange={(e) => setNewName(e.target.value)}
      />
      <Button
        label="Change name"
        onClick={() => changeNameMutation.mutate()}
        disabled={changeNameMutation.isPending || !validName}
      />
    </BaseModal>
  );
}
