import { BaseModal } from "../BaseModal";

type Props = {
  isOpen?: boolean;
  onRequestClose: (i?: InventoryItem) => void;
};

export function FriendListModal(props: Props) {
  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <h1>Friendlist info modal</h1>
      <h1>To be added</h1>
    </BaseModal>
  );
}
