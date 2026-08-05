import { useEffect, useState } from 'react';
import cn from 'classnames';
import styles from './style.module.scss';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { FaGem } from 'react-icons/fa';

import { BaseModal } from '../BaseModal';

import { InventoryItem } from '@/components/Items/InventoryItem';
import { Button } from '@/components/shared/Button';
import ForEach from '@/components/shared/ForEach';
import { When } from '@/components/shared/When';

import { useWebsocketApi } from '@/api/websocketServer';
import { useUserStore } from '@/store/user';
import { useModalStore } from '@/store/modal';
import { Query } from '@/store/query';
import { ITEM_QUALITY } from '@/constants';
import { Utils } from '@/utils';

type Props = {
  isOpen?: boolean;
  inventoryItem?: InventoryItem;
  onRequestClose: (i?: InventoryItem) => void;
};

/**
 * Raising an item's rarity by feeding a duplicate into it.
 *
 * The whole screen is built around one thing the player has to understand before
 * tapping: **the enhancement goes back to +0 whether the roll lands or not**. It
 * is the real price of the attempt — the silver spent reaching +5 is what is
 * being gambled, not the duplicate — so it is stated on the button itself rather
 * than tucked into a hint nobody reads.
 */
export function UpgradeItemModal(props: Props) {
  const api = useWebsocketApi();
  const queryClient = useQueryClient();
  const userStore = useUserStore();
  const modalStore = useModalStore();

  /** The duplicate to feed in, or none to let the server pick the cheapest. */
  const [selectedMaterialId, setSelectedMaterialId] = useState<number>();

  /** The last roll, kept only to play its animation. */
  const [outcome, setOutcome] = useState<{ id: number; success: boolean; quality: number }>();

  const item = props.inventoryItem;
  const quality = item?.quality ?? 1;
  const enhancement = item?.enhancement ?? 0;

  const upgradeMutation = useMutation({
    mutationFn: () =>
      api.items.upgradeItem({
        inventoryId: item?.id ?? 0,
        materialInventoryId: selectedMaterialId,
      }),
    onSuccess: (result) => {
      if (!result) return;
      setOutcome({ id: Date.now(), success: result.success, quality: result.quality });
      setSelectedMaterialId(undefined);
    },
    onSettled: () => queryClient.refetchQueries({ queryKey: [Query.USER_CHARACTER] }),
  });

  // The message plays once and leaves.
  useEffect(() => {
    if (!outcome) return;
    const timer = setTimeout(() => setOutcome(undefined), 1600);
    return () => clearTimeout(timer);
  }, [outcome]);

  // Every roll moves the item to a new stack — the enhancement is reset either
  // way — so the modal follows it, or the next attempt would target an
  // inventory id that no longer exists.
  useEffect(() => {
    if (!outcome || !item) return;
    const moved = userStore.user?.inventory?.find(
      (owned) =>
        owned.itemId === item.itemId &&
        owned.quality === outcome.quality &&
        owned.enhancement === 0 &&
        !owned.equipped &&
        !owned.locked,
    );
    if (moved && moved.id !== item.id) {
      modalStore.setInventoryItem({ selectedItem: moved });
    }
  }, [outcome, userStore.user]);

  /**
   * The copies that may legally be eaten: same item, same rarity, unlocked,
   * unequipped, and not already promised to a market listing. Mirrors the
   * server's own search so the list shown is the list it will pick from.
   *
   * The item's own stack only appears when it holds a second copy, since one of
   * them is the item being upgraded rather than the fuel.
   */
  const materials = (userStore.user?.inventory ?? [])
    .filter((owned) => {
      if (!item) return false;
      if (owned.itemId !== item.itemId || owned.quality !== item.quality) return false;
      if (owned.equipped || owned.locked) return false;
      const available = owned.stack - (owned.marketListing?.stack ?? 0);
      return owned.id === item.id ? available >= 2 : available >= 1;
    })
    .sort((a, b) => a.enhancement - b.enhancement);

  const chance = Utils.upgradeChance(quality);
  const isLegendary = quality >= Utils.MAX_QUALITY;
  const enhancedEnough = enhancement >= Utils.UPGRADE_MIN_ENHANCEMENT;
  const canUpgrade = !isLegendary && enhancedEnough && materials.length > 0;

  const currentName = ITEM_QUALITY[quality] ?? 'Common';
  const nextName = ITEM_QUALITY[quality + 1] ?? currentName;

  // The one the server would take if the player does not choose: the least
  // enhanced. Shown as pre-selected rather than left blank, so the row that is
  // about to be destroyed is never a surprise.
  const material = materials.find((owned) => owned.id === selectedMaterialId) ?? materials[0];

  return (
    <BaseModal onRequestClose={props.onRequestClose} isOpen={props.isOpen}>
      <div className={styles.itemInfoContainer}>
        <When value={!!outcome}>
          <span key={outcome?.id} className={cn(styles.outcome, { [styles.outcomeSuccess]: outcome?.success })}>
            {outcome?.success ? (ITEM_QUALITY[outcome.quality] ?? 'UPGRADED').toUpperCase() : 'FAILED'}
          </span>
        </When>

        {/* The rarity it is leaving and the one it is going to, with the item
            between them — the whole transaction in one line. */}
        <div className={styles.tierRow}>
          <span className={cn(styles.tier, styles[currentName])}>{currentName}</span>
          <span className={styles.tierArrow}>›</span>
          <InventoryItem inventoryItem={item} />
          <span className={styles.tierArrow}>›</span>
          <span className={cn(styles.tier, styles[nextName], { [styles.tierMuted]: isLegendary })}>
            {isLegendary ? '—' : nextName}
          </span>
        </div>

        <When value={!isLegendary}>
          <span className={styles.chance}>{chance}% chance</span>
        </When>

        {/* Stated plainly, above the button, because it is what the player is
            actually risking — the duplicate is the cheap half of the cost. */}
        <When value={canUpgrade}>
          <span className={styles.resetWarning}>Either way this drops back to +0</span>
        </When>

        <When value={isLegendary}>
          <span className={styles.blocked}>Legendary is the top — there is nowhere left to go</span>
        </When>
        <When value={!isLegendary && !enhancedEnough}>
          <span className={styles.blocked}>
            Needs +{Utils.UPGRADE_MIN_ENHANCEMENT} first — it is at +{enhancement}
          </span>
        </When>
        <When value={!isLegendary && enhancedEnough && materials.length === 0}>
          <span className={styles.blocked}>
            No spare {currentName} {item?.item?.name} to consume
          </span>
        </When>
      </div>

      <div className={styles.buttonsContainer}>
        <Button
          theme="gold"
          label={
            <span className={styles.buttonLabel}>
              <FaGem /> Consume a duplicate
            </span>
          }
          onClick={() => upgradeMutation.mutate()}
          disabled={!canUpgrade || upgradeMutation.isPending}
        />
      </div>

      <section className={styles.materialSection}>
        <span className={styles.sectionTitle}>Consume</span>
        <span className={styles.sectionHint}>
          Any spare copy at the same rarity, whatever it is enhanced to. It is destroyed whether the roll lands or not.
        </span>

        <When value={materials.length === 0}>
          <span className={styles.empty}>Nothing spare — a locked, worn or listed copy cannot be used</span>
        </When>

        <ForEach
          items={materials}
          render={(owned) => {
            const isSelected = owned.id === material?.id;
            const spare = owned.stack - (owned.marketListing?.stack ?? 0);

            return (
              // A picker, not an action: the upgrade is always the button above.
              <button
                key={owned.id}
                type="button"
                className={cn(styles.materialRow, { [styles.materialSelected]: isSelected })}
                disabled={upgradeMutation.isPending}
                onClick={() => setSelectedMaterialId(isSelected ? undefined : owned.id)}
              >
                <InventoryItem inventoryItem={owned} customSize={32} />
                <div className={styles.materialText}>
                  <span className={styles.materialName}>+{owned.enhancement}</span>
                  {/* The row the target itself lives in, so it is clear the copy
                      being eaten is not the one being upgraded. */}
                  <When value={owned.id === item?.id}>
                    <span className={styles.materialNote}>same stack as this item</span>
                  </When>
                </div>
                <span className={styles.materialStack}>{spare} spare</span>
              </button>
            );
          }}
        />
      </section>
    </BaseModal>
  );
}
