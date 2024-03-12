import { BaseModal } from "../BaseModal";

type Props = {
  isOpen?: boolean;
  onRequestClose: (i?: InventoryItem) => void;
};

export function PartyInfoModal(props: Props) {
  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <h1>Party info modal</h1>
      <h1>To be added</h1>
    </BaseModal>
  );
}
