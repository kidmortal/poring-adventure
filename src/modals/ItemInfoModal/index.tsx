import styles from './style.module.scss';

import { BaseModal } from '../BaseModal';
import { ItemStats } from '@/components/Items/ItemStats';
import { When } from '@/components/shared/When';

type Props = {
  isOpen?: boolean;
  item?: Item;
  onRequestClose: () => void;
};

/**
 * A catalogue entry: what an item is and what it grants, with nothing to do to
 * it. Used wherever an item is shown that you do not own — monster drops, for
 * one — where the inventory menu would make no sense.
 */
export function ItemInfoModal({ isOpen, item, onRequestClose }: Props) {
  const hasStats = !!(item?.attack || item?.str || item?.agi || item?.int || item?.health || item?.mana);

  return (
    <BaseModal isOpen={isOpen} onRequestClose={onRequestClose}>
      <div className={styles.container}>
        <img className={styles.image} src={item?.image} alt={item?.name} />

        {/* Stats are quoted at base quality: an actual drop rolls its own. */}
        <ItemStats
          inventoryItem={
            item
              ? {
                  id: 0,
                  itemId: item.id,
                  userEmail: '',
                  item,
                  stack: 1,
                  equipped: false,
                  locked: false,
                  enhancement: 0,
                  quality: 1,
                }
              : undefined
          }
        />

        <When value={hasStats}>
          <span className={styles.note}>Base values — quality and enhancement raise them.</span>
        </When>
        <When value={!hasStats}>
          <span className={styles.note}>A material: worth what someone will pay, or what it crafts into.</span>
        </When>
      </div>
    </BaseModal>
  );
}
