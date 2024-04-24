import { Broker } from '@/assets/Broker';
import { ToolTipDirection } from '../../shared/Tooltip';
import styles from './style.module.scss';
import cn from 'classnames';
import { When } from '../../shared/When';
import React from 'react';

const itemQuality = ['common', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'mythical'];

type Props = {
  inventoryItem?: InventoryItem;
  backgroundColor?: string;
  toolTip?: React.ReactNode;
  toolTipDirection?: ToolTipDirection;
  stack?: number;
  customSize?: number;
  onClick?: () => void;
};

export function InventoryItem({ customSize = 26, ...args }: Props) {
  const inventoryItem = args.inventoryItem;
  const item = args.inventoryItem?.item;
  let isOnSale = false;
  let stack = args.stack ?? 0;
  const quality = itemQuality[inventoryItem?.quality ?? 0];
  console.log(quality);

  isOnSale = !!inventoryItem?.marketListing;
  stack = args.stack || inventoryItem?.stack || 0;
  const enhancement = inventoryItem?.enhancement || 0;

  if (!inventoryItem) {
    return (
      <div
        style={{ backgroundColor: args.backgroundColor }}
        className={cn(styles.inventoryItemContainer, styles.empty)}
      />
    );
  }

  if (!item) {
    return (
      <div
        style={{ backgroundColor: args.backgroundColor }}
        className={cn(styles.inventoryItemContainer, styles.empty)}
      />
    );
  }

  return (
    <div
      onClick={args.onClick}
      style={{ backgroundColor: args.backgroundColor }}
      className={cn(styles.inventoryItemContainer, styles[itemQuality[inventoryItem.quality]])}
    >
      <img width={customSize} height={customSize} src={item.image} />
      <When value={stack > 1}>
        <span className={styles.stackAmount}>{stack}</span>
      </When>
      <When value={enhancement > 0}>
        <span
          className={cn(styles.enhancementAmount, {
            [styles.lowEnhancement]: enhancement > 0,
            [styles.midEnhancement]: enhancement > 6,
            [styles.highEnhancement]: enhancement > 9,
          })}
        >
          +{enhancement}
        </span>
      </When>

      <When value={isOnSale}>
        <div className={styles.saleIcon}>
          <Broker />
        </div>
      </When>
    </div>
  );
}
