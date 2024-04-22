import { Button } from '@/components/shared/Button';
import { BaseModal } from '../BaseModal';

type Props = {
  isOpen?: boolean;
  message: string;
  onRequestClose: (i?: boolean) => void;
  onConfirm?: () => void;
  onCancel?: () => void;
  isPending?: boolean;
};

export function ConfirmationModal(props: Props) {
  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <h2>{props.message}</h2>
      <Button theme="primary" label="Confirm" disabled={props.isPending} onClick={props.onConfirm} />
      <Button theme="danger" label="Cancel" disabled={props.isPending} onClick={props.onCancel} />
    </BaseModal>
  );
}
