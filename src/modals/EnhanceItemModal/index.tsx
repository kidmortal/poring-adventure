import styles from './style.module.scss';

import { useMutation } from '@tanstack/react-query';

import { BaseModal } from '../BaseModal';

import { InventoryItem } from '@/components/Items/InventoryItem';
import { Button } from '@/components/shared/Button';

import { useWebsocketApi } from '@/api/websocketServer';
import { Utils } from '@/utils';
import { Silver } from '@/components/StatsComponents/Silver';

type Props = {
  isOpen?: boolean;
  inventoryItem?: InventoryItem;
  onRequestClose: (i?: InventoryItem) => void;
};

export function EnhanceItemModal(props: Props) {
  const api = useWebsocketApi();

  const enhanceItemMutation = useMutation({
    mutationFn: () => api.items.enhanceItem({ inventoryId: props.inventoryItem?.id ?? 0 }),
    onSuccess: (success: boolean | undefined) => {
      if (success) {
        props.onRequestClose();
      }
    },
  });

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.itemInfoContainer}>
        <InventoryItem inventoryItem={props.inventoryItem} />
        <span>Chance {Utils.enhanceChance((props.inventoryItem?.enhancement ?? 0) + 1)}%</span>
        <Silver amount={Utils.enhancePrice((props.inventoryItem?.enhancement ?? 0) + 1)} />
      </div>
      <div className={styles.buttonsContainer}>
        <Button label="Enhance" onClick={() => enhanceItemMutation.mutate()} disabled={enhanceItemMutation.isPending} />
      </div>
    </BaseModal>
  );
}
