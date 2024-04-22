import styles from './style.module.scss';

import cn from 'classnames';
import { InventoryFilters } from '@/store/main';
import { When } from '../../shared/When';

export function ItemCategoryFilter({
  selected,
  onClick,
  hideLabels = false,
}: {
  selected: InventoryFilters;
  hideLabels?: boolean;
  onClick: (option: InventoryFilters) => void;
}) {
  return (
    <div className={styles.filtersContainer}>
      <div onClick={() => onClick('all')} className={cn(styles.filter, { [styles.selected]: selected === 'all' })}>
        <img height={20} width={20} src="https://kidmortal.sirv.com/misc/inventory.webp?w=20&h=20" />
        <When value={!hideLabels}>
          <span>All</span>
        </When>
      </div>
      <div
        onClick={() => onClick('equipment')}
        className={cn(styles.filter, {
          [styles.selected]: selected === 'equipment',
        })}
      >
        <img height={20} width={20} src="https://kidmortal.sirv.com/misc/equip.webp?w=20&h=20" />
        <When value={!hideLabels}>
          <span>Equipments</span>
        </When>
      </div>
      <div
        onClick={() => onClick('consumable')}
        className={cn(styles.filter, {
          [styles.selected]: selected === 'consumable',
        })}
      >
        <img height={20} width={20} src="https://kidmortal.sirv.com/misc/consumable.webp?w=20&h=20" />
        <When value={!hideLabels}>
          <span>Consumables</span>
        </When>
      </div>
      <div
        onClick={() => onClick('material')}
        className={cn(styles.filter, {
          [styles.selected]: selected === 'material',
        })}
      >
        <img height={20} width={20} src="https://kidmortal.sirv.com/misc/material.webp?w=20&h=20" />
        <When value={!hideLabels}>
          <span>Materials</span>
        </When>
      </div>
    </div>
  );
}
