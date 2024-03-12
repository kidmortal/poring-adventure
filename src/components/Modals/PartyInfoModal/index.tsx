import { useMutation, useQuery } from "@tanstack/react-query";
import styles from "./style.module.scss";
import { BaseModal } from "../BaseModal";
import { Query } from "@/store/query";
import { useMainStore } from "@/store/main";
import { useWebsocketApi } from "@/api/websocketServer";
import { When } from "@/components/When";
import { Button } from "@/components/Button";
import ForEach from "@/components/ForEach";
import { CharacterWithHealthBar } from "@/components/CharacterWithHealthBar";

type Props = {
  isOpen?: boolean;
  party?: Party;
  onRequestClose: (i?: InventoryItem) => void;
};

export function PartyInfoModal(props: Props) {
  const api = useWebsocketApi();
  const store = useMainStore();
  const query = useQuery({
    queryKey: [Query.PARTY],
    enabled: !!store.websocket,
    staleTime: 1000 * 2,
    queryFn: () => api.party.getParty(),
  });

  const createPartyMutation = useMutation({
    mutationFn: () => api.party.createParty(),
  });

  const deletePartyMutation = useMutation({
    mutationFn: () => api.party.removeParty(),
  });

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.container}>
        <When value={query.isLoading}>
          <span>Loading</span>
        </When>
        <When value={!query.isLoading}>
          <When value={!props.party?.id}>
            <Button
              label="Create a new party"
              onClick={() => createPartyMutation.mutate()}
              disabled={createPartyMutation.isPending}
            />
          </When>
          <When value={!!props.party?.id}>
            <ForEach
              items={props.party?.members}
              render={(u) => (
                <div className={styles.memberContainer}>
                  <CharacterWithHealthBar user={u} />
                  <Button label="Remove" />
                </div>
              )}
            />
            <Button
              label="Disband party"
              onClick={() => deletePartyMutation.mutate()}
              disabled={deletePartyMutation.isPending}
            />
          </When>
        </When>
      </div>
    </BaseModal>
  );
}
